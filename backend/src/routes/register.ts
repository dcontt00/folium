import express, {Request, Response} from "express"
import {userModel} from "../models";
import {User} from "../interfaces/user";
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10

router.post("/", async (req: Request, res: Response) => {
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
});

export default router;