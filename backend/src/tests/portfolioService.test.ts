import {before} from "mocha";
import connectDB from "@/db";
import {assert} from "chai";
import {createInitialPortfolio, getPortfolioByUrl, getPortfoliosByUserId} from "@/services/portfolioService";
import {createUser} from "@/services/userService";

let createdUser: any; // Variable to store the created user
let portfolio1: any
let portfolio2: any

before(async () => {
    console.log("before");
    const db = await connectDB()
    db?.createConnection()
    //await db?.connection?.dropDatabase()
    // Create a user and store it in the variable
    createdUser = await createUser("name", "surname", "username", "email", "password").then((result) => {
        return result.data
    });

})

after(async () => {
    console.log("after");
    // Clean up the database after tests
    const db = await connectDB()
    db?.createConnection()
    await db?.connection?.dropDatabase()
})


describe('Test Porfolio Service', function () {

    describe("Porfolio Creation", function () {
        it('Create Portfolio', async function () {
            const actualResult = await createInitialPortfolio("title", "url", "description", createdUser._id);

            assert.deepEqual(actualResult, {
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

    })

    describe('Get Portfolios', async function () {

        it('Get Portfolios of user by id', async function () {
            portfolio1 = await createInitialPortfolio("title1", "url1", "description1", createdUser._id);

            portfolio2 = await createInitialPortfolio("title2", "url2", "description2", createdUser._id);

            const portfolios = await getPortfoliosByUserId(createdUser._id)
            assert.isArray(portfolios);
            assert.lengthOf(portfolios, 2);
            assert.deepEqual(portfolios[0], {
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
            });
        });

        /* it('Get Portfolios of user by id with empty portfolios', async function () {
             const userWithoutPortfolios = await createUser("name2", "surname2", "username2", "email2", "password2").then((result) => {
                 return result.data;
             });
             console.log("userWithoutPortfolios ", userWithoutPortfolios);

             const portfolios = await getPortfoliosByUserId(userWithoutPortfolios._id.toString());
             assert.isArray(portfolios);
             assert.lengthOf(portfolios, 0);

         })*/

        it('Get porfolio by url', async function () {
            const portfolio1 = await createInitialPortfolio("title1", "url1", "description1", createdUser._id);

            const portfolio = await getPortfolioByUrl("url1");
            assert.isObject(portfolio);
            assert.deepEqual(portfolio, {
                _id: portfolio1.data._id, // Convert ObjectId to string for comparison
                title: "title1",
                description: "description1",
                url: "url1",
                user: createdUser._id,
                components: portfolio1.data.components,
                style: portfolio1.data.style, // Convert ObjectId to string for comparison
                versions: [],
                createdAt: portfolio1.data.createdAt,
                updatedAt: portfolio1.data.updatedAt,
                __v: 0,
            });
        })
    });
})