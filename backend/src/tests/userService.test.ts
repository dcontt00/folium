import {createUser} from "@/services/userService";
import {assert} from "chai";
import {beforeEach} from "mocha";
import connectDB from "@/db";


beforeEach(async () => {
    const db = await connectDB()
    await db?.connection?.dropDatabase()
})

describe('Test User Service', function () {

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

});