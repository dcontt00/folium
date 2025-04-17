import express, {NextFunction, Request, Response} from "express"
import {UserModel} from "../models";
import {User} from "../interfaces/user";
import {authHandler} from "../middleware/authHandler";

const router = express.Router();

// Edit user
router.put("/:username", authHandler, async (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;
    const username = req.params.username;

    await UserModel.findOneAndUpdate({username: username}, user, {new: true}).then((user) => {
        res.status(200).json({
            message: "User updated successfully",
            user: user,
        })
    })
});

export default router;
