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

        // Check if email exists TODO: Check if username exists
        const isEmailAllReadyExist = await userModel.findOne({
            email: user.email,
        });

        if (isEmailAllReadyExist) {
            res.status(400).json({
                status: 400,
                message: "Email all ready in use",
            });
            return;
        }

        // Hash the password
        bcrypt.hash(user.password, saltRounds, async (err, hash) => {
            if (err) throw err;
            // Create a new user

            user.password = hash;
            const newUser = await userModel.create(user);

            const userResponse = {
                name: newUser.name,
                email: newUser.email,
                username: newUser.username
            }

            res.status(200).json({
                status: 201,
                success: true,
                message: " User created Successfully",
                user: userResponse,
            });
        });


    } catch (error: any) {
        // console the error to debug
        console.log(error);

        // Send the error message to the client
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
});

export default router;