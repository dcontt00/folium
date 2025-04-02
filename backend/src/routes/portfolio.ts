import express from "express";
import {
    buttonComponentModel,
    componentModel,
    imageComponentModel,
    portfolioModel,
    textComponentModel
} from "../models/models";
import {authenticate} from "../middleware/auth";
import ApiError from "../interfaces/ApiError";
import mongoose from "mongoose";


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
            text: "You can add portfolioComponents from left menu",
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
    const removedComponents: any[] = [];
    const existingComponents: any[] = [];
    const newComponentsIds: any[] = [];
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(404, "User not found", "User not found");
        }

        const portfolio = await portfolioModel.findOne({url: req.params.url, user: user.id});

        if (!portfolio) {
            throw new ApiError(404, "Portfolio not found", "Portfolio not found");
        }

        if (req.body.components) {
            for (const component of req.body.components) {
                if (component._id != null) {
                    console.log("Component exists")
                    console.log("\n")

                    await editComponent(component).then(updatedComponent => {
                        console.log(updatedComponent)
                        components.push(updatedComponent._id);
                        existingComponents.push(updatedComponent._id);
                    })
                } else {
                    console.log("Component not exists")
                    await createComponent(component, portfolio._id).then((component) => {
                        components.push(component._id);
                        newComponentsIds.push(component._id);
                    });
                    console.log("\n")
                }
            }
        }
        console.log(components)

        // Remove components
        /*removedComponents.push(...existingComponents.filter(id => !newComponentsIds.includes(id)));
        await componentModel.deleteMany({_id: {$in: removedComponents}}).then((result) => {
            console.log(result)
        }).catch((err: any) => {
            console.log(err)
        })*/


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
        await removeOrphanComponents();

    } catch (err: any) {
        // Remove created portfolioComponents if anything goes wrong
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

        const components = portfolio.components.map((component: any) => component._id);
        await componentModel.deleteMany({_id: {$in: components}}).then((result) => {
            console.log(result)
        }).catch((err: any) => {
            console.log(err)
        })

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

async function createComponent(component: any, portfolio_id: mongoose.Types.ObjectId): Promise<any> {
    switch (component.__t) {
        case "TextComponent":
            if (!component.text) {
                throw new ApiError(400, "Text is required for text component", "Text is required for text component");
            }


            return await textComponentModel.create({
                type: component.type,
                index: component.index,
                text: component.text,
                portfolio_id: portfolio_id
            })

        case "ButtonComponent":
            if (!component.text || !component.url) {
                throw new ApiError(400, "Text and URL are required for button component", "Text and URL are required for button component");
            }
            return await buttonComponentModel.create({
                color: component.color,
                index: component.index,
                text: component.text,
                url: component.url,
                portfolio_id: portfolio_id
            })
        case "ImageComponent":
            if (!component.url) {
                throw new ApiError(400, "URL is required for image component", "URL is required for image component");
            }

            return await imageComponentModel.create({
                portfolio_id: portfolio_id,
                index: component.index,
                url: component.url,
            })
    }
}

async function editComponent(component: any): Promise<any> {
    switch (component.__t) {
        case "TextComponent":
            if (!component.text) {
                throw new ApiError(400, "Text is required for text component", "Text is required for text component");
            }

            return await textComponentModel.findOneAndUpdate(
                {_id: component._id},
                {type: component.type, index: component.index, text: component.text},
                {new: true}
            ).then(updatedComponent => {
                    return updatedComponent
                }
            );

        case "ButtonComponent":
            if (!component.text || !component.url) {
                throw new ApiError(400, "Text and URL are required for button component", "Text and URL are required for button component");
            }

            return await buttonComponentModel.findOneAndUpdate(
                {_id: component._id},
                {
                    type: component.type,
                    index: component.index,
                    text: component.text,
                    color: component.color,
                    url: component.url
                },
                {new: true}
            ).then(updatedComponent => {
                return updatedComponent
            })


        case "ImageComponent":
            if (!component.url) {
                throw new ApiError(400, "URL is required for image component", "URL is required for image component");
            }

            return await imageComponentModel.findOneAndUpdate(
                {_id: component._id},
                {
                    type: component.type,
                    index: component.index,
                    url: component.url
                },
                {new: true}
            ).then(updatedComponent => {
                return updatedComponent
            })
    }
}

async function removeOrphanComponents() {
    try {
        // Step 1: Get all component IDs that are referenced in any portfolio
        const portfolios = await portfolioModel.find({}, {components: 1});
        const referencedComponentIds = new Set<string>();
        portfolios.forEach(portfolio => {
            portfolio.components.forEach((componentId: mongoose.Types.ObjectId) => {
                referencedComponentIds.add(componentId.toString());
            });
        });

        // Step 2: Get all component IDs from the components collection
        const allComponents = await componentModel.find({}, {_id: 1});
        const allComponentIds = allComponents.map(component => component._id.toString());

        // Step 3: Find the difference between these two sets of IDs
        const orphanComponentIds = allComponentIds.filter(id => !referencedComponentIds.has(id));
        console.log(orphanComponentIds);

        // Step 4: Remove orphan components
        await componentModel.deleteMany({_id: {$in: orphanComponentIds}});

    } catch (e) {
        console.error(e);
    }
}