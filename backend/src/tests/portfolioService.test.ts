import connectDB from "@/db";
import {afterAll, beforeAll, describe, expect} from '@jest/globals';
import {createUser} from "@/services/userService";
import {
    createInitialPortfolio,
    editPortfolio,
    getPortfolioByUrl,
    getPortfoliosByUserId,
    removePortfolioByUrl
} from "@/services/portfolioService";
import styleModel from "@/models/StyleModel";
import {createDirectories} from "@/utils/directories";


let createdUser: any = null;
let portfolio1: any = null;

beforeAll(async () => {
    const db = await connectDB().then((result) => {
        console.log("Connected to database successfully");
        return result;
    })
    await db?.connection?.dropDatabase()


    // Create directories for storing images and HTML files
    createDirectories()

    createdUser = await createUser("name", "surname", "username", "user@mail.com", "password")
        .then((result) => {
            return result.data
        });

    await createInitialPortfolio("title1", "url1", "description1", createdUser._id)
    await createInitialPortfolio("title2", "url2", "description2", createdUser._id)
    portfolio1 = await getPortfolioByUrl("url1")
}, 10000)
afterAll(async () => {
    const db = await connectDB()
    await db?.connection?.dropDatabase();
    await db?.connection?.close()
})

describe('Test Porfolio Service', function () {
    describe("Initial Porfolio Creation", function () {
        test('Create Initial Portfolio', async function () {
            const actualResult = await createInitialPortfolio("title", "url", "description", createdUser._id);

            expect(actualResult).toStrictEqual({
                success: true,
                status: 200,
                data: {
                    _id: actualResult.data._id, // Convert ObjectId to string for comparison
                    title: "title",
                    description: "description",
                    url: "url",
                    user: createdUser._id,
                    components: [
                        {
                            _id: actualResult.data.components[0]._id, // Convert ObjectId to string for comparison
                            className: actualResult.data.components[0].className,
                            index: 0,
                            parent_id: actualResult.data._id,
                            __t: "ImageComponent",
                            url: "https://placehold.co/600x100",
                            componentId: actualResult.data.components[0].componentId,
                            createdAt: actualResult.data.components[0].createdAt,
                            updatedAt: actualResult.data.components[0].updatedAt,
                            __v: 0,
                        },
                        {
                            _id: actualResult.data.components[1]._id, // Convert ObjectId to string for comparison
                            className: actualResult.data.components[1].className,
                            index: 1,
                            parent_id: actualResult.data._id,
                            __t: "TextComponent",
                            text: "Welcome to your new portfolio",
                            style: "normal",
                            type: "h1",
                            fontSize: 0,
                            componentId: actualResult.data.components[1].componentId,
                            createdAt: actualResult.data.components[1].createdAt,
                            updatedAt: actualResult.data.components[1].updatedAt,
                            __v: 0,
                        },
                        {
                            _id: actualResult.data.components[2]._id, // Convert ObjectId to string for comparison
                            className: actualResult.data.components[2].className,
                            index: 2,
                            parent_id: actualResult.data._id,
                            __t: "TextComponent",
                            text: 'You can add components from left menu',
                            style: "normal",
                            type: "p",
                            fontSize: 0,
                            componentId: actualResult.data.components[2].componentId,
                            createdAt: actualResult.data.components[2].createdAt,
                            updatedAt: actualResult.data.components[2].updatedAt,
                            __v: 0,
                        }
                    ],

                    style: actualResult.data.style, // Convert ObjectId to string for comparison
                    versions: [],
                    createdAt: actualResult.data.createdAt,
                    updatedAt: actualResult.data.updatedAt,
                    __v: 0,
                },
            });
        });
        it('Create Initial Portfolio with empty title', async function () {
            return createInitialPortfolio("", "url", "description", createdUser._id)
                .catch(error => expect(error.message)
                    .toMatch("Portfolio validation failed: title: Path `title` is required."));
        })
        it('Create Initial Portfolio with duplicated url', async function () {
            return createInitialPortfolio("title", "url1", "description", createdUser._id)
                .catch(error => expect(error.message)
                    .toMatch("URL already exists"));
        })

    })

    describe('Get Portfolios of user', function () {
        test('Get Portfolios of user by id', async function () {
            const portfolios = await getPortfoliosByUserId(createdUser._id.toString())
            expect(portfolios.length).toBeGreaterThan(0)
            expect(portfolios[0].user).toStrictEqual(createdUser._id)
        });

        test('Get Portfolios of user by id that does not exist', async function () {
            return getPortfoliosByUserId("1234")
                .catch(error => expect(error.message)
                    .toMatch("User not found"));
        })
    });

    describe("Get portfolio by url", function () {
        test('Get portfolio by url', async function () {
            const portfolio = await getPortfolioByUrl("url1");
            expect(portfolio.title).toBe("title1");
        })

        test('Get portfolio by url that does not exist', async function () {
            return getPortfolioByUrl("nonexistent-url")
                .catch(error => expect(error.message)
                    .toMatch("Portfolio not found"));
        })
    })

    describe("Remove portfolio", function () {
        test("Remove portfolio by url", async function () {
            const portfolios = await getPortfoliosByUserId(createdUser._id.toString())
            expect(portfolios.length).toBeGreaterThan(0)

            await removePortfolioByUrl("url2")
            const removedPortfolio = await getPortfolioByUrl("url2");
            expect(removedPortfolio).toBeNull();
        })
        test("Remove portfolio by url that does not exist", async function () {
            return removePortfolioByUrl("nonexistent-url")
                .catch(error => expect(error.message)
                    .toMatch("Portfolio not found"));
        })
    })

    describe("Edit portfolio", function () {
        test("Edit portfolio title", async function () {
            const styleArray = Array.from(portfolio1.style); // Convert Map to an array

            const updatedPortfolio = await editPortfolio("url1", "new title", "description", portfolio1.components, styleArray);
            expect(updatedPortfolio.data.title).toBe("new title");
        })
        test("Modify text of second component", async function () {
            const portfolio = await getPortfolioByUrl("url1");
            const afterComponents = JSON.parse(JSON.stringify(portfolio.components));
            const prevStyle = await styleModel.findById(portfolio.style).populate("classes").lean();

            // Modify the text of the second component
            afterComponents[1].text = "Modified text";

            const updatedPortfolio = await editPortfolio(portfolio.url, portfolio.title, portfolio.description, afterComponents, prevStyle);

            expect(updatedPortfolio.data.components[1].text).toBe("Modified text");
        })
        test("Modify index of first and second component", async function () {
            const portfolio = await getPortfolioByUrl("url1");
            const afterComponents = JSON.parse(JSON.stringify(portfolio.components));
            const prevStyle = await styleModel.findById(portfolio.style).populate("classes").lean();

            // Modify the index of the first and second components
            afterComponents[0].index = 1;
            afterComponents[1].index = 0;

            const updatedPortfolio = await editPortfolio(portfolio.url, portfolio.title, portfolio.description, afterComponents, prevStyle);

            expect(updatedPortfolio.data.components[0].index).toBe(1);
            expect(updatedPortfolio.data.components[1].index).toBe(0);
        })
        test("Edit portfolio of invalid url", async function () {
            return editPortfolio("invalid-url", "new title", "description", portfolio1.components, portfolio1.style)
                .catch(error => expect(error.message)
                    .toMatch("Portfolio not found"));
        })

        test("Edit portfolio with empty title", async function () {
            const portfolio = await getPortfolioByUrl("url1");
            const afterComponents = JSON.parse(JSON.stringify(portfolio.components));
            const prevStyle = await styleModel.findById(portfolio.style).populate("classes").lean();

            return editPortfolio("url1", "", "description", afterComponents, prevStyle)
                .catch(error => expect(error.message)
                    .toMatch("Portfolio validation failed: title: Path `title` is required."));
        })
    })
})
