import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {UserModel} from "../models";
import config from "../utils/config";
import AuthenticationError from '../interfaces/AuthError';

export const authHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token: string = req.cookies.jwt;
            if (!token) {
                res.status(401);
                throw new AuthenticationError("Not authorized, token not found");
            }

            const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

            if (!decoded || !decoded.userId) {
                res.status(401);
                throw new AuthenticationError("Not authorized, userId not found");
            }

            const user = await UserModel.findById(decoded.userId, "_id name email");

            if (!user) {
                res.status(401);
                throw new AuthenticationError("Not authorized, user not found");
            }

            const {id, name, email} = user;
            console.log(id, name, email)

            req.user = {id, name, email};
            next();
        } catch (e: any) {
            throw new AuthenticationError("Not authorized, invalid token");
        }
    }
);

