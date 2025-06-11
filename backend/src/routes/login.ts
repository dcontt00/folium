import express, {NextFunction, Request, Response} from "express";
import {AuthenticationError} from "@/classes";
import {login} from "@/services/userService";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    // ** Get The User Data From Body ;
    const {email, password} = req.body

    try {
        const token = await login(email, password);

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }).status(200).json({
            status: 200,
            success: true,
            message: "Login success",
        });
    } catch (error: any) {
        next(new AuthenticationError("Wrong password"));
    }


});

export default router;