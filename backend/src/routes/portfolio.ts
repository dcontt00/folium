import express from "express";
import {
    buttonComponentModel,
    componentModel,
    containerComponentModel,
    imageComponentModel,
    portfolioModel,
    textComponentModel,
    versionModel
} from "../models/models";
import {authenticate} from "../middleware/auth";
import ApiError from "../interfaces/ApiError";
import mongoose from "mongoose";
import {componentsAreEquals, createVersion} from "../services/portfolioService";
import Component from "../interfaces/component";
import {ChangeType} from "../interfaces/IChange";


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
            parent_id: newPortfolio._id
        })

        const textComponent = await textComponentModel.create({
            index: 1,
            text: "You can add portfolioComponents from left menu",
            parent_id: newPortfolio._id
        })

        await portfolioModel.findOneAndUpdate(
            {url: newPortfolio.url, user: user.id},
            {...req.body, components: [titleComponent._id, textComponent._id]},
            {new: true}
        ).populate("components").then(async (portfolio) => {
            res.status(200).json({
                status: 200,
                success: true,
                data: portfolio,
            });

            if (portfolio == null) {
                throw new ApiError(404, "Portfolio not found", "Portfolio not found");
            }

            await versionModel.create(
                {
                    portfolioId: portfolio._id,
                    changes: {type: ChangeType.NEW_PORTFOLIO, message: "Created Portfolio"},
                    components: portfolio.components,
                    title: portfolio.title,
                    description: portfolio.description,
                    url: portfolio.url,
                }
            ).then(() => {
                console.log("Version created")
            }).catch((err => {
                console.log("Error creating version", err)
            }))
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

router.get("/:_id/versions", authenticate, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(404, "User not found", "User not found");
        }

        await versionModel
            .find({portfolioId: req.params._id})
            .sort({createdAt: -1})
            .then((versions) => {
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: versions,
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

        await portfolioModel.findOne({url: req.params.url, user: user.id})
            .populate({
                path: "components",
                populate: {
                    path: "components",
                }
            })
            .then((portfolio) => {
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
        if (!user) {
            throw new ApiError(404, "User not found", "User not found");
        }

        const portfolio = await portfolioModel
            .findOne({url: req.params.url, user: user.id})
            .populate({
                path: "components",
                populate: {
                    path: "components",
                }
            });

        if (!portfolio) {
            throw new ApiError(404, "Portfolio not found", "Portfolio not found");
        }


        if (req.body.components) {
            for (const reqComponent of req.body.components) {
                const portfolioComponent = portfolio.components.find((component: any) => component.componentId === reqComponent.componentId);

                // If portfolioComponent===undefined -> Created new component

                if (!componentsAreEquals(reqComponent, portfolioComponent)) {
                    await createComponent(reqComponent, portfolio._id).then((c) => {
                        components.push(c);
                    });
                } else {
                    components.push(portfolioComponent);
                }
            }
        }

        await portfolioModel.findOneAndUpdate(
            {url: req.params.url, user: user.id},
            {...req.body, components: components},
            {new: true}
        ).populate({
            path: "components",
            populate: {
                path: "components",
            }
        }).then(async (updatedPortfolio) => {
            res.status(200).json({
                status: 200,
                success: true,
                data: updatedPortfolio,
            });

            if (updatedPortfolio == null) {
                throw new ApiError(404, "Portfolio not found", "Portfolio not found");
            }

            await createVersion(portfolio, updatedPortfolio)
        })
        //await removeOrphanComponents();

    } catch (err: any) {
        console.log(err)

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

        await versionModel.deleteMany({portfolioId: portfolio._id})

        await removeOrphanComponents()

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

async function createComponent(component: any, parent_id: mongoose.Types.ObjectId): Promise<any> {
    switch (component.__t) {
        case "TextComponent":
            if (!component.text) {
                throw new ApiError(400, "Text is required for text component", "Text is required for text component");
            }
            return await textComponentModel.create({
                componentId: component.componentId,
                type: component.type,
                index: component.index,
                text: component.text,
                parent_id: parent_id
            })

        case "ButtonComponent":
            if (!component.text || !component.url) {
                throw new ApiError(400, "Text and URL are required for button component", "Text and URL are required for button component");
            }
            return await buttonComponentModel.create({
                componentId: component.componentId,
                color: component.color,
                index: component.index,
                text: component.text,
                url: component.url,
                parent_id: parent_id
            })
        case "ImageComponent":
            if (!component.url) {
                throw new ApiError(400, "URL is required for image component", "URL is required for image component");
            }

            return await imageComponentModel.create({
                componentId: component.componentId,
                parent_id: parent_id,
                index: component.index,
                url: component.url,
            })
        case "ContainerComponent":
            const containerComponents: Array<any> = [];

            // Create container component
            const containerComponent = await containerComponentModel.create({
                componentId: component.componentId,
                parent_id: parent_id,
                index: component.index,
            })


            // Create each component of container assigning the containerComponent as parent
            for (const comp of component.components) {
                await createComponent(comp, containerComponent._id).then((c) => {
                    containerComponents.push(c._id);
                })
            }

            // Update the containerComponent with the created components
            return await containerComponentModel.findOneAndUpdate(
                {_id: containerComponent._id},
                {components: containerComponents},
                {new: true}
            ).then(updatedComponent => {
                return updatedComponent
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
                    url: component.url,
                    caption: component.caption,
                    overlayText: component.overlayText
                },
                {new: true}
            ).then(updatedComponent => {
                return updatedComponent
            })

        case "ContainerComponent":
            const containerComponents: Array<any> = [];
            for (const containerComponent of component.components) {
                if (containerComponent._id != null) {
                    await editComponent(containerComponent).then((component) => {
                        containerComponents.push(component._id);
                    })
                } else {
                    await createComponent(containerComponent, containerComponent.parent_id).then((component) => {
                        containerComponents.push(component._id);
                    })
                }
            }
            return await containerComponentModel.findOneAndUpdate(
                {_id: component._id},
                {index: component.index, components: containerComponents},
                {new: true}
            ).then(updatedComponent => {
                return updatedComponent
            })
    }
}

async function removeOrphanComponents() {
    try {
        // Step 1: Get all component IDs that are referenced in any portfolio or containerComponent
        const portfolios = await portfolioModel.find({}, {components: 1}).populate("components");
        const referencedComponentIds = new Set<string>();
        portfolios.forEach(portfolio => {
            portfolio.components.forEach((component: Component) => {
                referencedComponentIds.add(component._id.toString());
            });
        });


        // Step 2: Get all component IDs from the components collection
        const allComponents = await componentModel.find({}, {_id: 1});
        const allComponentIds = allComponents.map(component => component._id.toString());

        // Step 3: Find the difference between these two sets of IDs
        const orphanComponentIds = allComponentIds.filter(id => !referencedComponentIds.has(id));
        console.log("Orphan component IDs:", orphanComponentIds);
        console.log("Referenced component IDs:", referencedComponentIds);

        // Step 4: Remove orphan components
        await componentModel.deleteMany({_id: {$in: orphanComponentIds}});

    } catch (e) {
        console.error(e);
    }
}