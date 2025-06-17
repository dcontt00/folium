import connectDB from "@/db";
import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';
import {createUser, login} from "@/services/userService";


beforeAll(async () => {
    await connectDB()
    await createUser("name", "surname", "username", "email", "password");
});
afterAll(async () => {
    const db = await connectDB()
    await db?.connection?.dropDatabase();
    await db?.connection?.close()
})

describe('Test User Service', function () {

    describe("User Creation", function () {

        test('Create user', async () => {

            const actualResult = await createUser(
                "name1",
                "surname1",
                "username1",
                "email1",
                "password1"
            );

            return expect(actualResult)
                .toStrictEqual({
                    status: 201,
                    success: true,
                    data: {
                        name: "name1",
                        email: "email1",
                        username: "username1",
                        _id: actualResult.data._id, // Convert ObjectId to string for comparison
                    }
                });
        });

        test('Create user with missing fields', async function () {
            return createUser("", "surname2", "username", "email2", "password2")
                .catch(error => expect(error.message)
                    .toMatch("Error creating user"));
        });


        test('Create user with duplicate username', async function () {
            await createUser("name2", "surname2", "username2", "email2", "password");
            return createUser("name2", "surname2", "username2", "email2", "password")
                .catch(error => expect(error.message)
                    .toMatch("A user with this username already exists"));
        });
    })


    describe("Test Login", function () {
        test('Login with valid credentials', async function () {
            const token = await login("email", "password");
            expect(typeof token).toBe('string');
        });

        test('Login with invalid email', async function () {
            return login("invalid-email", "surname2")
                .catch(error => expect(error.message)
                    .toMatch("User not found"));
        });

        test('Login with wrong password', async function () {
            return login("email", "wrong-password")
                .catch(error => expect(error.message)
                    .toMatch("Wrong password"));
        });
    })

});
