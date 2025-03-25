import express from "express";
import {buttonComponentModel, portfolioModel, textComponentModel} from "../models/models";
import {authenticate} from "../middleware/auth";
import ApiError from "../interfaces/ApiError";
import imageComponentModel from "../models/portfolioComponents/imageComponentModel";


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


        const newPortfolio = await portfolioModel.create({
            url: req.body.url,
            title: req.body.title,
            description: req.body.description,
            user: user.id,
        })

        const titleComponent = await textComponentModel.create({
            index: 0,
            text: "Welcome to your new portfolio",
            type: "h1",
            portfolio_id: newPortfolio._id
        })

        const textComponent = await textComponentModel.create({
            index: 1,
            text: "You can add components from left menu",
            portfolio_id: newPortfolio._id
        })

        await portfolioModel.findOneAndUpdate(
            {url: newPortfolio.url, user: user.id},
            {...req.body, components: [titleComponent._id, textComponent._id]},
            {new: true}
        ).populate("components").then((portfolio) => {
            res.status(200).json({
                status: 200,
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
            throw new ApiError(404, "User not found", "User not found");
        }

        await portfolioModel.find({user: user.id}).then((portfolios) => {
            res.status(200).json({
                status: 200,
                success: true,
                data: portfolios,
            });
        });


    } catch (err: any) {
        if (err instanceof ApiError) {
            res.status(err.status).json({
                status: err.status,
                success: false,
                message: err.message,
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

router.get("/:url", authenticate, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(404, "User not found", "User not found");
        }

        await portfolioModel.findOne({url: req.params.url, user: user.id}).populate("components").then((portfolio) => {
            if (!portfolio) {
                throw new ApiError(404, "Portfolio not found", "Portfolio not found");
            }

            res.status(200).json({
                status: 200,
                success: true,
                data: portfolio,
            });
        });

    } catch (err: any) {
        if (err instanceof ApiError) {
            res.status(err.status).json({
                status: err.status,
                success: false,
                message: err.message,
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

router.put("/:url", authenticate, async (req, res) => {
    const components: any[] = [];

    try {
        const user = req.user;
        console.log(req.body);

        if (!user) {
            throw new ApiError(404, "User not found", "User not found");
        }

        const portfolio = await portfolioModel.findOne({url: req.params.url, user: user.id});

        if (!portfolio) {
            throw new ApiError(404, "Portfolio not found", "Portfolio not found");
        }

        if (req.body.components) {
            for (const component of req.body.components) {
                switch (component.__t) {
                    case "TextComponent":
                        if (!component.text) {
                            throw new ApiError(400, "Text is required for text component", "Text is required for text component");
                        }
                        await textComponentModel.create({
                            type: component.type,
                            index: component.index,
                            text: component.text,
                            portfolio_id: portfolio._id
                        }).then((textComponent) => {
                            components.push(textComponent._id)
                        })

                        break;
                    case "ButtonComponent":
                        if (!component.text || !component.url) {
                            throw new ApiError(400, "Text and URL are required for button component", "Text and URL are required for button component");
                        }
                        await buttonComponentModel.create({
                            color: component.color,
                            index: component.index,
                            text: component.text,
                            url: component.url,
                            portfolio_id: portfolio._id
                        }).then((buttonComponent) => {
                            components.push(buttonComponent._id)
                        })
                        break;
                    case "ImageComponent":
                        if (!component.url) {
                            throw new ApiError(400, "URL is required for image component", "URL is required for image component");
                        }
                        await imageComponentModel.create({
                            portfolio_id: portfolio._id,
                            index: component.index,
                            url: component.url,
                        }).then((imageComponent) => {
                            components.push(imageComponent._id)
                        })
                        break;
                }
            }
        }

        await portfolioModel.findOneAndUpdate(
            {url: req.params.url, user: user.id},
            {...req.body, components: components},
            {new: true}
        ).populate("components").then((portfolio) => {
            res.status(200).json({
                status: 200,
                success: true,
                data: portfolio,
            });
        })

    } catch (err: any) {
        // Remove created components if anything goes wrong
        for (const component of components) {
            await textComponentModel.findByIdAndDelete(component._id)
        }

        if (err instanceof ApiError) {
            res.status(err.status).json({
                status: err.status,
                success: false,
                message: err.message,
            });
        } else {
            res.status(400).json({
                status: 400,
                success: false,
                message: err.message,
            });
        }
    }
})


router.delete("/:url", authenticate, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            throw new Error("User not found");
        }

        console.log("URL: " + req.params.url)
        console.log("User id: " + user.id)

        const portfolio = await portfolioModel.findOne({url: req.params.url});

        if (!portfolio) {
            throw new ApiError(404, "Portfolio not found", "Portfolio not found");
        }

        await portfolioModel.deleteOne({url: req.params.url}).then(() => {
            res.status(200).json({
                status: 200,
                success: true,
            });
        })

    } catch (err: any) {
        if (err instanceof ApiError) {
            res.status(err.status).json({
                status: err.status,
                success: false,
                message: err.message,
            });
        } else {
            res.status(400).json({
                status: 400,
                success: false,
                message: err.message,
            });
        }
    }
})

export default router;