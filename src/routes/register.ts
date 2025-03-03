import express, {Request, Response} from "express"
import {userModel} from "../models/models";
import {User} from "../interfaces/user";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        // ** Get The User Data From Body ;
        const user: User = req.body;

        // Check if email exists
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

        // Create a new user
        const newUser = await userModel.create(user);

        res.status(200).json({
            status: 201,
            success: true,
            message: " User created Successfully",
            user: newUser,
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