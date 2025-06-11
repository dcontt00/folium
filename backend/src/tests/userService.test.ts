import {createUser, login} from "@/services/userService";
import {assert} from "chai";
import {beforeEach} from "mocha";
import connectDB from "@/db";


beforeEach(async () => {
    const db = await connectDB()
    await db?.connection?.dropDatabase()
})

describe('Test User Service', function () {

    describe("User Creation", function () {


        it('Create user', async function () {
            const actualResult = await createUser("name", "surname", "username", "email", "password");

            assert.deepEqual(actualResult, {
                status: 201,
                success: true,
                message: "User created Successfully",
                user: {
                    name: "name",
                    email: "email",
                    username: "username"
                }
            });
        });

        it('Create user with missing fields', async function () {
            try {
                await createUser("", "surname", "username", "email", "password");
            } catch (error: any) {
                assert.equal(error.message, "Error creating user");
            }
        });

        it('Create user with invalid email', async function () {
            try {
                await createUser("name", "surname", "username", "invalid-email", "password");
            } catch (error: any) {
                assert.equal(error.message, "Invalid email format");
            }
        });

        it('Create user with duplicate username', async function () {
            await createUser("name", "surname", "username", "email", "password");
            try {
                await createUser("name2", "surname2", "username", "email2", "password2");
            } catch (error: any) {
                assert.equal(error.message, "Username already exists");
            }
        });
    })


    describe("Test Login", function () {
        it('Login with valid credentials', async function () {
            await createUser("name", "surname", "username", "email", "password");
            const token = await login("email", "password");

            assert.isString(token);
        });

        it('Login with invalid email', async function () {
            try {
                await login("invalid-email", "password");
            } catch (error: any) {
                assert.equal(error.message, "User not found");
            }
        });

        it('Login with wrong password', async function () {
            await createUser("name", "surname", "username", "email", "password");
            try {
                await login("email", "wrong-password");
            } catch (error: any) {
                assert.equal(error.message, "Wrong password");
            }
        });
    })

});