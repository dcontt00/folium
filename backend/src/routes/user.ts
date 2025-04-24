import express, {NextFunction, Request, Response} from "express"
import {UserModel} from "@/models";
import {authHandler} from "@/middleware";
import {ApiError} from "@/classes";

const router = express.Router();

// Edit user
router.put("/", authHandler, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(400, "User data is required");
    }

    // User data
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const username = req.body.username;


    await UserModel
        .findOneAndUpdate(
            {_id: user.id,},
            {
                name: name,
                surname: surname,
                email: email,
                username: username,
            },
            {new: true}
        )
        .then((user) => {
            console.log(user)
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
