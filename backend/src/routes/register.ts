import express, {Request, Response} from "express"
import {IUser} from "@/interfaces";
import {createUser} from "@/services/userService";
import {ApiError} from "@/classes";

const router = express.Router();
const saltRounds = 10

router.post("/", async (req: Request, res: Response) => {
    // ** Get The User Data From Body ;
    const user: IUser = req.body;

    await createUser(user.name, user.surname, user.username, user.email, user.password).then((result) => {
        res.status(result.status).json({
            success: result.success,
            user: result.data
        });
    }).catch((err: ApiError) => {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "An error occurred while creating the user",
            timestamp: err.timestamp || new Date().toISOString()
        });
    })

});

export default router;