import express, {Request, Response} from "express";
import {userModel} from "../models/models";
import jwt from "jsonwebtoken"
import config from "../utils/config";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        // ** Get The User Data From Body ;
        const {email, password} = req.body

        // Check if user exists
        const user = await userModel.findOne({
            email: email,
        });

        if (!user) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
            return;
        }

        const isPasswordMatched =
            user?.password === user.password;

        // Check password
        if (!isPasswordMatched) {
            res.status(400).json({
                status: 400,
                success: false,
                message: "wrong password",
            });
            return;
        }

        const userId = user.id
        // Create JWT token
        const token = jwt.sign(
            {userId},
            config.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // Set the token in a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: "login success",
            token: token,
        });
    } catch (e) {
        console.error("Error on login", e);
    }
});

export default router;