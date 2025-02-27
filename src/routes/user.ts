import express, {Request, Response} from "express"
import {userModel} from "../models/models";
import {User} from "../interfaces/user";

const router = express.Router();

/* GET users listing. */
router.get('/', async function (req: Request, res: Response, next) {
    console.log("test")
    await userModel.find({}).then((users) => {
        res.json(users);

    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
    });
});

// Edit user
router.put("/:username", async (req: Request, res: Response) => {
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
