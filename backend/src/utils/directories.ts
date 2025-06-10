import fs from "fs";
import path from "path";

function getRootFolder() {

    if (process.env.NODE_ENV === "production") {
        return path.resolve(__dirname, '../');
    }
    return path.resolve(__dirname, '../../');
}

function getExportsFolder() {
    return path.join(getRootFolder(), "exports");
}

function getImagesFolder() {
    return path.join(getRootFolder(), "images");
}

function getPortfolioImagesFolder() {
    return path.join(getRootFolder(), "images", "portfolios");
}

function getThumbnailsFolder() {
    return path.join(getRootFolder(), "images", "thumbnails");
}

function getPublicFolder() {
    return path.join(getRootFolder(), "src", "public");
}

function getHtmlFolder() {
    return path.join(getRootFolder(), "html");
}


function createDirectories() {
    const exportsFolder = getExportsFolder();
    const imagesFolder = getImagesFolder();
    const htmlFolder = getHtmlFolder();
    const thumbnailsFolder = getThumbnailsFolder();

    if (!fs.existsSync(exportsFolder)) {
        fs.mkdirSync(exportsFolder);
        console.log("Created exports folder in ", exportsFolder);
    }
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
        console.log("Created images folder in ", imagesFolder);
    }
    if (!fs.existsSync(htmlFolder)) {
        fs.mkdirSync(htmlFolder);
        console.log("Created html folder in ", htmlFolder);
    }
    if (!fs.existsSync(thumbnailsFolder)) {
        fs.mkdirSync(thumbnailsFolder);
        console.log("Created thumbnails folder in ", thumbnailsFolder);
    }
}

export {
    getExportsFolder,
    createDirectories,
    getImagesFolder,
    getHtmlFolder,
    getPublicFolder,
    getPortfolioImagesFolder,
    getThumbnailsFolder

}

