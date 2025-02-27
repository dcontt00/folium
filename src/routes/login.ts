import express, {Request, Response} from "express";
import {userModel} from "../models/models";
import jwt from "jsonwebtoken"

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        // ** Get The User Data From Body ;
        const user = req.body;

        // ** destructure the information from user;
        const {name, email, password} = user;
        console.log(name, email, password);


        // Check if user exists
        const isUserExist = await userModel.findOne({
            email: email,
        });

        if (!isUserExist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
            return;
        }

        const isPasswordMatched =
            isUserExist?.password === password;

        // Check password
        if (!isPasswordMatched) {
            res.status(400).json({
                status: 400,
                success: false,
                message: "wrong password",
            });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            {_id: isUserExist?._id, email: isUserExist?.email},
            "YOUR_SECRET",
            {
                expiresIn: "1d",
            }
        );

        res.status(200).json({
            status: 200,
            success: true,
            message: "login success",
            token: token,
        });
    } catch (e) {
        console.error(e)
    }
});

export default router;