import express, {NextFunction, Request, Response} from "express"
import {UserModel} from "@/models";
import {IUser} from "@/interfaces";
import {authHandler} from "@/middleware";
import {ApiError} from "@/classes";

const router = express.Router();

// Edit user
router.put("/:username", authHandler, async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser = req.body;
    const username = req.params.username;

    await UserModel.findOneAndUpdate({username: username}, user, {new: true}).then((user) => {
        res.status(200).json({
            message: "User updated successfully",
            user: user,
        })
    })
});

// Get user
router.get("/", authHandler, async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    await UserModel.findById(user.id).then((user) => {
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }
        res.status(200).json({
            message: "User found successfully",
            user: user,
        })
    })

});

export default router;
