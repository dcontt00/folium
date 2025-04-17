import express, {NextFunction, Request, Response} from "express";
import {UserModel} from "@/models";
import jwt from "jsonwebtoken"
import config from "@/utils/config";
import bcrypt from "bcrypt";
import AuthenticationError from "@/classes/AuthenticationError";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    // ** Get The User Data From Body ;
    const {email, password} = req.body

    // Check if user exists
    const user = await UserModel.findOne({
        email: email,
    });

    if (!user) {
        throw new AuthenticationError("User not found");
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
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
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.status(200).json({
                status: 200,
                success: true,
                message: "Login success",
            });
        } else {
            next(new AuthenticationError("Wrong password"));
        }
    });
});

export default router;