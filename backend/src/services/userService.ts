import {UserModel} from "@/models";
import bcrypt from "bcrypt";
import {ApiError, AuthenticationError} from "@/classes";
import jwt from "jsonwebtoken";
import config from "@/utils/config";
import {IServiceResult} from "@/interfaces";

const saltRounds = 10

async function createUser(name: string, surname: string, username: string, email: string, password: string): Promise<IServiceResult> {
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
            _id: user._id,
        };

        return {
            status: 201,
            success: true,
            data: userResponse,
        };

    } catch (err: any) {
        if (err.code === 11000) {
            const duplicatedKey = Object.keys(err.keyValue)[0];
            throw new ApiError(400, "A user with this " + duplicatedKey + " already exists");
        } else {
            throw new ApiError(400, "Error creating user");
        }
    }
}

async function login(email: string, password: string) {
    const user = await UserModel.findOne({
        email: email,
    });

    if (!user) {
        throw new AuthenticationError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const userId = user.id;
        // Create JWT token
        const token = jwt.sign(
            {userId},
            config.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return token;
    } else {
        throw new ApiError(400, "Wrong password");
    }
}


export {
    createUser,
    login
}