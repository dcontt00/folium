import express, {Request, Response} from "express"
import {userModel} from "../models/models";
import {User} from "../interfaces/user";
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10

router.post("/", async (req: Request, res: Response) => {
    try {
        // ** Get The User Data From Body ;
        const user: User = req.body;

        // Hash the password
        user.password = await bcrypt.hash(user.password, saltRounds)

        await userModel.create(user).then((user) => {
            const userResponse = {
                name: user.name,
                email: user.email,
                username: user.username
            }

            res.status(200).json({
                status: 201,
                success: true,
                message: "User created Successfully",
                user: userResponse,
            });
        })
    } catch (error: any) {
        console.error("Error on register", error);

        if (error.code == 11000) {
            const keys = Object.keys(error.errorResponse.keyValue)
            res.status(400).json({
                status: 400,
                message: `${keys} already exists`,
            });
        } else {
            res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    }
});

export default router;