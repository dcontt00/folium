import express from "express";
import {portfolioModel} from "../models/models";
import {authenticate} from "../middleware/auth";


const router = express.Router();


router.post("/", authenticate, async (req, res) => {
    try {

        // Get user from the request
        const user = req.user;

        if (!user) {
            throw new Error("User not found");
        }

        if (!req.body.url || !req.body.title) {
            throw new Error("URL and title are required");
        }

        await portfolioModel.create({
            url: req.body.url,
            title: req.body.title,
            description: req.body.description,
            user: user.id,
        }).then((portfolio) => {
            res.status(201).json({
                status: 201,
                success: true,
                data: portfolio,
            });
        })

    } catch (err: any) {
        if (err.code === 11000) {
            res.status(400).json({
                status: 400,
                success: false,
                message: "URL already exists",
            });
        } else {
            res.status(400).json({
                status: 400,
                success: false,
                message: err.message,
            });
        }

    }
});

router.get("/", authenticate, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            throw new Error("User not found");
        }

        await portfolioModel.find({user: user.id}).then((portfolios) => {
            res.status(200).json({
                status: 200,
                success: true,
                data: portfolios,
            });
        });


    } catch (err: any) {
        res.status(400).json({
            status: 400,
            success: false,
            message: err.message,
        });
    }
});

router.put("/:url", authenticate, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            throw new Error("User not found");
        }

        await portfolioModel.findOneAndUpdate(
            {url: req.params.url, user: user.id},
            req.body,
            {new: true}
        ).then((portfolio) => {
            if (!portfolio) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Portfolio not found",
                });
                return;
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: portfolio,
                });
            }
        });
    } catch (err: any) {
        res.status(400).json({
            status: 400,
            success: false,
            message: err.message,
        });
    }
})

export default router;