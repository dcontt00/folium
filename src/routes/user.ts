import express, {NextFunction, Request, Response} from "express"
import {userModel} from "../models/models";
import {User} from "../interfaces/user";
import {authenticate} from "../middleware/auth";

const router = express.Router();

/* TODO: Only for testing */
router.get('/', authenticate, async function (req: Request, res: Response) {
    await userModel.find({}).then((users) => {
        res.json(users);

    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
    });
});

// Edit user
router.put("/:username", authenticate, async (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;
    const username = req.params.username;

    await userModel.findOneAndUpdate({username: username}, user, {new: true}).then((user) => {
        res.status(200).json({
            message: "User updated successfully",
            user: user,
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
    });
});

export default router;
