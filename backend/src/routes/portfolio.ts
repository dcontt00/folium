import express from "express";
import {
    ButtonComponentModel,
    ComponentModel,
    ContainerComponentModel,
    ImageComponentModel,
    PortfolioModel,
    TextComponentModel,
    VersionModel
} from "@/models";
import {authHandler} from "@/middleware";
import {ApiError, AuthenticationError} from "@/classes";
import mongoose from "mongoose";
import {componentsAreEquals, createPortfolio, createVersion} from "@/services/portfolioService";
import {ChangeType, IComponent, IPortfolio} from "@/interfaces";


const router = express.Router();


router.post("/", authHandler, async (req, res) => {

    // Get user from the request
    const user = req.user;

    if (!user) {
        throw new AuthenticationError("User not found");
    }

    if (!req.body.url || !req.body.title) {
        throw new ApiError(500, "URL and title are required");
    }

    const newPortfolio = await createPortfolio(req.body.title, req.body.url, user.id, req.body.description)

    const titleComponent = await TextComponentModel.create({
        index: 0,
        text: "Welcome to your new portfolio",
        type: "h1",
        parent_id: newPortfolio._id
    })

    const textComponent = await TextComponentModel.create({
        index: 1,
        text: "You can add components from left menu",
        parent_id: newPortfolio._id
    })


    await PortfolioModel
        .findOneAndUpdate(
            {url: newPortfolio.url, user: user.id},
            {...req.body, components: [titleComponent._id, textComponent._id]},
            {new: true}
        )
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        })
        .then(async (portfolio) => {
            console.log(portfolio);
            if (portfolio == null) {
                throw new ApiError(404, "Portfolio not found");
            }
            res.status(200).json({
                status: 200,
                success: true,
                data: portfolio,
            });


            await VersionModel.create(
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


});

router.get("/", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await PortfolioModel.find({user: user.id}).then((portfolios) => {
        res.status(200).json({
            status: 200,
            success: true,
            data: portfolios,
        });
    });


});

router.get("/:portfolioId/versions", authHandler, async (req, res) => {

    await VersionModel
        .find({portfolioId: req.params.portfolioId})
        .sort({createdAt: -1})
        .then((versions) => {
            console.log(versions)
            res.status(200).json({
                status: 200,
                success: true,
                data: versions,
            });
        });


});


router.get("/version/:versionId", authHandler, async (req, res) => {


    const versionId = req.params.versionId;

    if (!versionId) {
        throw new ApiError(400, "Version ID is required");
    }

    const version = await VersionModel.findById(versionId);

    if (version == null) {
        throw new ApiError(404, "Version not found");
    }

    const components = await ComponentModel.find({_id: {$in: version.components}}).lean();

    if (req.query.restore == 'true') {

        // Update portfolio
        await PortfolioModel
            .findOneAndUpdate({
                _id: version.portfolioId,
            }, {
                components: components,
                title: version.title,
                description: version.description,
                url: version.url,
            }, {new: true})
            .populate({
                path: "components",
                populate: {
                    path: "components",
                }
            })
            .then((portfolio) => {
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: portfolio,
                });
            });

        // Delete version newer than the restored version
        await VersionModel.deleteMany({
            portfolioId: version.portfolioId,
            createdAt: {$gt: version.createdAt}
        }).then(() => {
            console.log("Deleted versions newer than", version.createdAt);
        })
    } else {
        const portfolio: IPortfolio = {
            _id: version.portfolioId,
            title: version.title,
            description: version.description,
            url: version.url,
            components: components,
        }
        res.status(200).json({
            status: 200,
            success: true,
            data: portfolio,
        });
    }


})

router.get("/:portfolioUrl/view", authHandler, async (req, res) => {

    await PortfolioModel
        .findOne({url: req.params.portfolioUrl})
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        }).then((portfolio) => {
            if (!portfolio) {
                throw new ApiError(404, "Portfolio not found");
            }

            res.status(200).json({
                status: 200,
                success: true,
                data: portfolio.toHtml(),
            });
        })


})


router.get("/:url", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await PortfolioModel.findOne({url: req.params.url, user: user.id})
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        })
        .then((portfolio) => {
            if (!portfolio) {
                throw new ApiError(404, "Portfolio not found");
            }

            res.status(200).json({
                status: 200,
                success: true,
                data: portfolio,
            });
        });


});

router.put("/:url", authHandler, async (req, res) => {
    const components: any[] = [];
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const portfolio = await PortfolioModel
        .findOne({url: req.params.url, user: user.id})
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        });

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
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

    await PortfolioModel.findOneAndUpdate(
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
            throw new ApiError(404, "Portfolio not found");
        }

        await createVersion(portfolio, updatedPortfolio)
    })

})


router.delete("/:url", authHandler, async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new Error("User not found");
    }

    const portfolio = await PortfolioModel.findOne({url: req.params.url});

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
    }

    await PortfolioModel.deleteOne({url: req.params.url}).then(() => {
        res.status(200).json({
            status: 200,
            success: true,
        });
    })

    await VersionModel.deleteMany({portfolioId: portfolio._id})

    await removeOrphanComponents()


})

export default router;

async function createComponent(component: any, parent_id: mongoose.Types.ObjectId): Promise<any> {
    switch (component.__t) {
        case "TextComponent":
            if (!component.text) {
                throw new ApiError(400, "Text is required for text component");
            }
            return await TextComponentModel.create({
                componentId: component.componentId,
                type: component.type,
                index: component.index,
                text: component.text,
                parent_id: parent_id
            })

        case "ButtonComponent":
            if (!component.text || !component.url) {
                throw new ApiError(400, "Text and URL are required for button component");
            }
            return await ButtonComponentModel.create({
                componentId: component.componentId,
                color: component.color,
                index: component.index,
                text: component.text,
                url: component.url,
                parent_id: parent_id
            })
        case "ImageComponent":
            if (!component.url) {
                throw new ApiError(400, "URL is required for image component");
            }

            return await ImageComponentModel.create({
                componentId: component.componentId,
                parent_id: parent_id,
                index: component.index,
                url: component.url,
                width: component.width,
                caption: component.caption,
                overlayText: component.overlayText,
            })
        case "ContainerComponent":
            const containerComponents: Array<any> = [];

            // Create container component
            const containerComponent = await ContainerComponentModel.create({
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
            return await ContainerComponentModel.findOneAndUpdate(
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
                throw new ApiError(400, "Text is required for text component");
            }

            return await TextComponentModel.findOneAndUpdate(
                {_id: component._id},
                {type: component.type, index: component.index, text: component.text},
                {new: true}
            ).then(updatedComponent => {
                    return updatedComponent
                }
            );

        case "ButtonComponent":
            if (!component.text || !component.url) {
                throw new ApiError(400, "Text and URL are required for button component");
            }

            return await ButtonComponentModel.findOneAndUpdate(
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
                throw new ApiError(400, "URL is required for image component");
            }

            return await ImageComponentModel.findOneAndUpdate(
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
            return await ContainerComponentModel.findOneAndUpdate(
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
        const portfolios = await PortfolioModel.find({}, {components: 1}).populate("components");
        const referencedComponentIds = new Set<string>();
        portfolios.forEach(portfolio => {
            portfolio.components.forEach((component: IComponent) => {
                referencedComponentIds.add(component._id.toString());
            });
        });


        // Step 2: Get all component IDs from the components collection
        const allComponents = await ComponentModel.find({}, {_id: 1});
        const allComponentIds = allComponents.map(component => component._id.toString());

        // Step 3: Find the difference between these two sets of IDs
        const orphanComponentIds = allComponentIds.filter(id => !referencedComponentIds.has(id));
        console.log("Orphan component IDs:", orphanComponentIds);
        console.log("Referenced component IDs:", referencedComponentIds);

        // Step 4: Remove orphan components
        await ComponentModel.deleteMany({_id: {$in: orphanComponentIds}});

    } catch (e) {
        console.error(e);
    }
}