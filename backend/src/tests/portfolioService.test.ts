import connectDB from "@/db";
import {afterAll, beforeAll, describe, expect} from '@jest/globals';
import {createUser} from "@/services/userService";
import {
    createInitialPortfolio,
    editPortfolio,
    getPortfolioByUrl,
    getPortfoliosByUserId
} from "@/services/portfolioService";
import styleModel from "@/models/StyleModel";
import Changes from "@/classes/Changes";
import Component from "@/classes/components/Component";
import Change from "@/classes/Change";
import {getComponentUpdatesAndRemovals} from "@/services/versionService";


let createdUser: any = null;
let portfolio1: any = null;

beforeAll(async () => {
    const db = await connectDB().then((result) => {
        console.log("Connected to database successfully");
        return result;
    })
    await db?.connection?.dropDatabase()
    createdUser = await createUser("name2", "surname", "username", "user@mail.com", "password")
        .then((result) => {
            return result.data
        });

    portfolio1 = await createInitialPortfolio("title1", "url1", "description1", createdUser._id)
})
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

    describe('Get Portfolios', function () {

        test('Get Portfolios of user by id', async function () {
            console.log(createdUser)

            const portfolios = await getPortfoliosByUserId(createdUser._id.toString())

            expect(portfolios.length).toBeGreaterThan(0)
            expect(portfolios[0]).toStrictEqual({
                _id: portfolios[0]._id, // Convert ObjectId to string for comparison
                title: "title1",
                description: "description1",
                url: "url1",
                user: createdUser._id,
                components: portfolios[0].components,
                style: portfolios[0].style, // Convert ObjectId to string for comparison
                versions: [],
                createdAt: portfolios[0].createdAt,
                updatedAt: portfolios[0].updatedAt,
                __v: 0,
            })

        });


        test('Get porfolio by url', async function () {
            const portfolio = await getPortfolioByUrl("url1");
            expect(portfolio.title).toBe("title1");
        })

        test("Get component updates and removals", async function () {

            // Get portfolio by URL and clone components for comparison
            const portfolio4 = await getPortfolioByUrl("url1")
            const beforeComponents = JSON.parse(JSON.stringify(portfolio4.components));
            const afterComponents = JSON.parse(JSON.stringify(portfolio4.components));
            const prevStyle = await styleModel.findById(portfolio4.style).populate("classes").lean();


            // Update a component's text
            afterComponents[1].text = "Updated text";
            const updatedPortfolio = await editPortfolio(portfolio4.url, portfolio4.title, portfolio4.description, afterComponents, prevStyle)

            // Get the updated styles
            const afterStyle = await styleModel.findById(updatedPortfolio.data.style).populate("classes").lean();

            // Get component updates and removals
            const changes = new Changes()
            // @ts-ignore
            await getComponentUpdatesAndRemovals(beforeComponents, afterComponents, prevStyle, afterStyle, changes)


            const expectedComponentChanges: Map<Component, Change[]> = new Map()
            expectedComponentChanges.set(beforeComponents[1], [
                new Change("text", 'Welcome to your new portfolio', "Updated text")
            ]);
            console.log("beforeComponents", beforeComponents)
            const expectedChanges: Changes = new Changes()
            expectedChanges.portfolioCreated = false;
            expectedChanges.componentChanges = expectedComponentChanges;
            expectedChanges.portfolioChanges = [];
            expectedChanges.componentAdditions = [];

            console.log("changes", changes)
            console.log("expectedChanges", expectedChanges)

            expect(changes).toStrictEqual(expectedChanges)


        })
    });
})
