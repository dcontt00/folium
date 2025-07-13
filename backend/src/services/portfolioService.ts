import {PortfolioModel, VersionModel} from "@/models";
import {IServiceResult, IVersion} from "@/interfaces";
import {ApiError} from "@/classes";
import {
    componentsAreEquals,
    createComponent,
    createImageComponent,
    createTextComponent,
    removeOrphanComponents
} from "@/services/componentService";
import TextType from "@/interfaces/TextType";
import path from "path";
import fs from "fs";
import archiver from "archiver"
import {getHtmlFolder, getImagesFolder, getPortfolioImagesFolder, getPublicFolder} from "@/utils/directories";
import {createPortfolioStyle} from "@/services/styleService";
import mongoose from "mongoose";
import styleModel from "@/models/StyleModel";
import StyleClass from "@/classes/StyleClass";
import puppeteer from "puppeteer";
import {createFirstVersion, createVersion} from "@/services/versionService";
import styleClassModel from "@/models/StyleClassModel";

/**
 * Generates HTML and CSS files for a portfolio based on its URL.
 * @param {string} portfolioUrl - The URL of the portfolio.
 * @returns {Promise<string>} - The path to the generated HTML file.
 * @throws {Error} - Throws an error if the portfolio or style is not found.
 */
async function generateHtmlFiles(portfolioUrl: string): Promise<string> {
    const portfolio = await PortfolioModel.findOne({url: portfolioUrl}).populate({
        path: 'components',
        populate: {
            path: 'components',
        },
    });


    if (!portfolio) {
        throw new Error('Portfolio not found');
    }

    const style = await styleModel.findById(portfolio.style).populate("classes")

    if (!style) {
        throw new Error('Style not found');
    }

    // Generate the HTML using the toHtml method
    const cssContent = style.toString()
    const htmlContent = portfolio.toHtml();
    const htmlFolder = getHtmlFolder()

    // Define the output directory and file path
    const outputDir = path.join(htmlFolder, portfolioUrl);
    fs.mkdirSync(outputDir, {recursive: true}); // Create the directory if it doesn't exist
    const htmlFilePath = path.join(outputDir, 'index.html');
    const cssFilePath = path.join(outputDir, 'styles.css');
    const imagesPath = path.join(outputDir, "images");

    // Write the HTML content to the file
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
    fs.writeFileSync(cssFilePath, cssContent, 'utf-8');

    // Copy images from the portfolio's images folder to the output directory
    if (!fs.existsSync(imagesPath)) {
        fs.mkdirSync(imagesPath, {recursive: true});
    }


    // Copy images to the output directory
    const portfolioImagesPath = path.join(getImagesFolder(), "portfolios", portfolioUrl)
    const publicPath = getPublicFolder()
    if (fs.existsSync(portfolioImagesPath)) {

        // Copy placeholder image from public folder to portfolio images folder
        const placeHolderSourcePath = path.join(publicPath, "placeholder.jpg");
        const placeHolderDestPath = path.join(outputDir, "images", "placeholder.jpg");
        fs.copyFileSync(placeHolderSourcePath, placeHolderDestPath);

        // Copy images
        const images = fs.readdirSync(portfolioImagesPath);
        for (const image of images) {
            const sourcePath = path.join(portfolioImagesPath, image);
            const destPath = path.join(outputDir, "images", image);
            fs.copyFileSync(sourcePath, destPath);
        }
    }
    await takeScreenshot(htmlFilePath, getImagesFolder() + `/thumbnails/${portfolioUrl}`)
    return htmlFilePath;
}

/**
 * Creates a new portfolio in the database.
 * @param {string} title - The title of the portfolio.
 * @param {string} url - The URL of the portfolio.
 * @param {string} userId - The ID of the user creating the portfolio.
 * @param {string} description - A description of the portfolio.
 * @param {mongoose.Types.ObjectId} style - The style ID associated with the portfolio.
 * @param {boolean} [populate=false] - Whether to populate the portfolio's components.
 * @returns {Promise<any>} - The created portfolio object.
 * @throws {ApiError} - Throws an error if the URL already exists or a server error occurs.
 */
async function createPortfolio(
    title: string, url: string, userId: string, description: string, style: mongoose.Types.ObjectId, populate: boolean = false
): Promise<any> {

    const portfolio = await PortfolioModel
        .create(
            {
                title: title,
                description: description,
                url: url,
                user: userId,
                style: style
            })
        .catch((err) => {
            if (err.code === 11000) { // MongoDB duplicate key error
                throw new ApiError(400, "URL already exists");
            } else if (err instanceof mongoose.Error.ValidationError) {
                throw new ApiError(400, err.message);
            } else {
                throw new ApiError(500, "Server Error");
            }
        })
    if (populate) {
        return await portfolio
            .populate({
                path: "components",
                populate: {
                    path: "components",
                }
            });
    }
    return portfolio;
}

/**
 * Creates an initial portfolio with default components and generates its first version.
 * @param {string} title - The title of the portfolio.
 * @param {string} url - The URL of the portfolio.
 * @param {string} description - A description of the portfolio.
 * @param {string} userId - The ID of the user creating the portfolio.
 * @throws {ApiError} - Throws an error if the portfolio creation fails.
 */
async function createInitialPortfolio(
    title: string,
    url: string,
    description: string,
    userId: string,
): Promise<IServiceResult> {
    const style = await createPortfolioStyle()
    const newPortfolio = await createPortfolio(title, url, userId, description, style._id)
    const imageComponent = await createImageComponent(
        0,
        "https://placehold.co/600x100",
        newPortfolio._id,
        style._id)

    const titleComponent = await createTextComponent(
        1,
        "Welcome to your new portfolio",
        TextType.H1,
        newPortfolio._id,
        style._id
    )
    const textComponent = await createTextComponent(
        2,
        "You can add components from left menu",
        TextType.P,
        newPortfolio._id,
        style._id
    )
    return await PortfolioModel
        .findOneAndUpdate(
            {url: url},
            {
                title: title,
                description: description,
                components: [imageComponent._id, titleComponent._id, textComponent._id]
            },
            {new: true}
        )
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        })
        .lean()
        .then(async (portfolio) => {
            if (portfolio == null) {
                throw new ApiError(404, "Portfolio not found");
            }
            await createFirstVersion(portfolio)
            await generateHtmlFiles(url)
            return {
                success: true,
                status: 200,
                data: portfolio,
            }
        }).catch((err) => {
            console.log("Error creating version", err)
            throw new ApiError(500, "Error creating portfolio");
        })
}

/**
 * Retrieves all portfolios associated with a specific user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any[]>} - An array of portfolios.
 */
async function getPortfoliosByUserId(userId: string): Promise<any> {
    return PortfolioModel.find({user: userId}).lean().catch(error => {
        throw new ApiError(500, "User not found");
    })
}


/**
 * Retrieves a portfolio by its URL.
 * @param {string} url - The URL of the portfolio.
 * @returns {Promise<any>} - The portfolio object.
 * @throws {ApiError} - Throws an error if the portfolio retrieval fails.
 */
async function getPortfolioByUrl(url: string): Promise<any> {

    return PortfolioModel.findOne({url: url})
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        }).populate({
            path: "style",
            populate: {
                path: "classes"
            }
        }).catch((err) => {
            console.log("Error getting portfolio by url", err)
            throw new ApiError(500, "Error getting portfolio by url");
        })

}

/**
 * Removes a portfolio by its URL, including associated components, versions, and files.
 * @param {string} url - The URL of the portfolio.
 * @throws {ApiError} - Throws an error if the portfolio is not found or deletion fails.
 */
async function removePortfolioByUrl(url: string): Promise<IServiceResult> {
    const portfolio = await PortfolioModel.findOne({url: url});

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
    }

    try {
        await PortfolioModel.deleteOne({url: url})
        await VersionModel.deleteMany({portfolioId: portfolio._id})
        await removeOrphanComponents()

        // Remove images folder
        const imagesFolder = path.join(getPortfolioImagesFolder(), portfolio.url);
        if (fs.existsSync(imagesFolder)) {
            fs.rmSync(imagesFolder, {recursive: true, force: true});
        }

        // Remove html folder
        const htmlFolder = path.join(getHtmlFolder(), portfolio.url);
        if (fs.existsSync(htmlFolder)) {
            fs.rmSync(htmlFolder, {recursive: true, force: true});
        }
        return {
            success: true,
            status: 200,
            data: null,
        }

    } catch (error) {
        console.log("Error deleting portfolio", error)
        throw new ApiError(500, "Error deleting portfolio");
    }
}

/**
 * Restores a portfolio to a specific version.
 * @param {IVersion} version - The version object containing portfolio details.
 * @param {any} components - The components to restore.
 * @param {any} style - The style to restore.
 * @returns {Promise<any>} - The restored portfolio object.
 */
async function restorePortfolio(version: IVersion, components: any, style: any) {
    return PortfolioModel
        .findOneAndUpdate({
            _id: version.portfolioId,
        }, {
            components: components,
            title: version.title,
            description: version.description,
            url: version.url,
            style: style
        }, {new: true})
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        }).populate({
            path: "style",
            populate: {
                path: "classes"
            }
        });
}


/**
 * Zips the portfolio folder and returns the path to the zip file.
 * @param {string} portfolioUrl - The URL of the portfolio.
 * @returns {Promise<string>} - The path to the zip file.
 * @throws {Error} - Throws an error if the zipping process fails.
 */
async function exportPortfolioAsZip(portfolioUrl: string): Promise<string> {
    // Generate HTMl files for the portfolio
    await generateHtmlFiles(portfolioUrl)

    const rootFolder = path.resolve(__dirname, '../../');
    const exportFolder = path.join(rootFolder, "exports")

    const htmlFolder = getHtmlFolder()
    const outputFilePath = path.join(exportFolder, `${portfolioUrl}.zip`);
    const sourceDir = path.join(htmlFolder, portfolioUrl);


    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputFilePath);
        const archive = archiver('zip', {zlib: {level: 9}});

        output.on('close', () => {
            console.log(`Zipped ${archive.pointer()} total bytes`);
            resolve(outputFilePath);
        });

        archive.on('error', (err: any) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });


}

async function editPortfolio(
    portfolioUrl: string,
    portfolioTitle: string,
    portfolioDescription: string,
    reqComponents: any,
    reqStyle: any
): Promise<IServiceResult> {
    const portfolio = await getPortfolioByUrl(portfolioUrl);
    const components = [];

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
    }

    let portfolioStyle = undefined


    if (reqComponents) {
        for (const reqComponent of reqComponents) {
            const portfolioComponent = portfolio.components.find((component: any) => component.componentId === reqComponent.componentId);
            if (!componentsAreEquals(reqComponent, portfolioComponent)) {
                await createComponent(reqComponent, portfolio._id).then((c) => {
                    components.push(c);
                });
            } else {
                components.push(portfolioComponent);
            }
        }
    }
    console.log(reqStyle.classes)


    await styleModel.findById(portfolio.style)
        .then(async (style) => {
            if (style == null) {
                throw new ApiError(404, "Style not found");
            }
            const updatedClasses = reqStyle.classes || {};
            const newClasses: any[] = [];


            for (const styleClass of Object.values(updatedClasses) as StyleClass[]) {

                if (styleClass == null) {
                    continue
                }
                // Create a new style class
                // @ts-ignore
                delete styleClass._id;

                const newStyleClass = await styleClassModel
                    .create(styleClass)
                    .catch(error => {
                        console.log("Error creating style class", error)
                        throw new ApiError(500, "Error creating style class");
                    });

                newClasses.push(newStyleClass)
            }

            const classesMap = newClasses.reduce((map, newStyleClass) => {
                map[`${newStyleClass.identifier}`] = newStyleClass._id;
                return map;
            }, {});

            portfolioStyle = await styleModel.create({
                classes: classesMap,
            });
        }).catch((err) => {
            console.log(err)
        })

    return await PortfolioModel
        .findOneAndUpdate(
            {url: portfolioUrl},
            {
                title: portfolioTitle,
                description: portfolioDescription,
                components: components,
                style: portfolioStyle!!._id
            },
            {new: true}
        )
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        })
        .populate({
            path: "style",
            populate: {
                path: "classes"
            }
        })
        .then(async (updatedPortfolio) => {
            console.log(5)

            if (updatedPortfolio == null) {
                throw new ApiError(404, "Portfolio not found");
            }

            await createVersion(portfolio, updatedPortfolio)
            await generateHtmlFiles(portfolioUrl)


            return {
                success: true,
                status: 200,
                data: updatedPortfolio,
            }
        }).catch((err) => {
            console.log("Error editing portfolio", err)
            throw new ApiError(500, "Error editing portfolio");
        })
}

/**
 * Takes a screenshot of the portfolio's HTML file.
 * @param {string} htmlFilePath - The path to the HTML file.
 * @param {string} outputPath - The path to save the screenshot.
 */
async function takeScreenshot(htmlFilePath: string, outputPath: string) {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.setViewport({width: 600, height: 200})

    // Load the HTML file
    const fileUrl = `file://${path.resolve(htmlFilePath)}`;
    await page.goto(fileUrl, {waitUntil: 'networkidle0'});

    // Take a screenshot
    await page.screenshot({path: `${outputPath}.png`, fullPage: true});

    await browser.close();
}


export {
    createInitialPortfolio,
    getPortfoliosByUserId,
    getPortfolioByUrl,
    removePortfolioByUrl,
    restorePortfolio,
    generateHtmlFiles,
    exportPortfolioAsZip,
    editPortfolio
}