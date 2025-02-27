import express, {Request, Response} from "express"
import {userModel} from "../models/models";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        // ** Get The User Data From Body ;
        const user = req.body;

        // ** destructure the information from user;
        const {name, email, password} = user;
        console.log(name, email, password);

        // ** Check the email all ready exist  in database or not ;
        // ** Import the user model from "./models/user";

        const isEmailAllReadyExist = await userModel.findOne({
            email: email,
        });

        // ** Add a condition if the user exist we will send the response as email all ready exist
        if (isEmailAllReadyExist) {
            res.status(400).json({
                status: 400,
                message: "Email all ready in use",
            });
            return;
        }

        // ** if not create a new user ;
        // !! Don't save the password as plain text in db . I am saving just for demonstration.
        // ** You can use bcrypt to hash the plain password.

        // now create the user;
        const newUser = await userModel.create({
            name,
            email,
            password,
        });

        // Send the newUser as  response;
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