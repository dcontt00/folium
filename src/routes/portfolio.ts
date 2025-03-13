import express from "express";
import {portfolioModel} from "../models/models";
import {authenticate} from "../middleware/auth";


const router = express.Router();


router.post("/", authenticate, async (req, res) => {
    try {

        console.log()

        // Get user from the request
        const user = req.user;

        if (!user) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
            return;
        }

        const portfolio = await portfolioModel.create({
            url: req.body.url,
            title: req.body.title,
            description: req.body.description,
            user: user.id,
        });

        res.status(201).json({
            status: 201,
            success: true,
            data: portfolio,
        });
    } catch (err: any) {
        res.status(400).json({
            status: 400,
            success: false,
            message: err.message,
        });
    }
});

router.get("/", authenticate, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
            return;
        }

        const portfolios = await portfolioModel.find({user: user.id});

        res.status(200).json({
            status: 200,
            success: true,
            data: portfolios,
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
            res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
            return;
        }

        const portfolio = await portfolioModel.findOneAndUpdate(
            {url: req.params.url, user: user.id},
            req.body,
            {new: true}
        );

        if (!portfolio) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Portfolio not found",
            });
            return;
        }

        res.status(200).json({
            status: 200,
            success: true,
            data: portfolio,
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