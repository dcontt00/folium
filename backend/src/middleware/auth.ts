import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {userModel} from "../models/models";
import {AuthenticationError} from "./error";
import config from "../utils/config";

export const authenticate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401);
                throw new AuthenticationError("Not authorized, token not found");
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

            if (!decoded || !decoded.userId) {
                res.status(401);
                throw new AuthenticationError("Not authorized, userId not found");
            }

            const user = await userModel.findById(decoded.userId, "_id name email");

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

