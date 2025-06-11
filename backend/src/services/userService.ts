import {UserModel} from "@/models";
import bcrypt from "bcrypt";
import {ApiError} from "@/classes";

const saltRounds = 10

async function createUser(name: string, surname: string, username: string, email: string, password: string) {
    try {
        const user = await UserModel.create({
            name: name,
            surname: surname,
            username: username,
            email: email,
            password: await bcrypt.hash(password, saltRounds),
        });

        const userResponse = {
            name: user.name,
            email: user.email,
            username: user.username,
        };

        return {
            status: 201,
            success: true,
            message: "User created Successfully",
            user: userResponse,
        };

    } catch (err: any) {
        console.error(err);

        if (err.code === 11000) {
            const duplicatedKey = Object.keys(err.keyValue)[0];
            throw new ApiError(400, "A user with this " + duplicatedKey + " already exists");
        } else {
            throw new ApiError(400, "Error creating user");
        }
    }
}


export {
    createUser
}