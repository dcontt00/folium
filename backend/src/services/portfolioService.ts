import {PortfolioModel, VersionModel} from "@/models";
import {ChangeType, IChange, IVersion} from "@/interfaces";
import {ApiError, Portfolio} from "@/classes";
import {createTextComponent, removeOrphanComponents} from "@/services/componentService";
import Component from "@/classes/components/Component";

// Create portfolio
async function createPortfolio(
    title: string, url: string, userId: string, description?: string, populate: boolean = false
) {

    const portfolio = await PortfolioModel
        .create(
            {
                title: title,
                description: description,
                url: url,
                user: userId
            })
        .catch((err) => {
            if (err.code === 11000) { // MongoDB duplicate key error
                throw new ApiError(400, "URL already exists");
            } else {
                throw new ApiError(500, "Server Error");
            }
        })
    if (populate) {
        return await portfolio
            .populate({
                path: "components",
                populate: {
                    path: "components",
                }
            });
    }
    return portfolio;
}

async function createInitialPortfolio(
    title: string,
    url: string,
    description: string,
    userId: string,
) {
    const newPortfolio = await createPortfolio(title, url, userId, description)

    const titleComponent = await createTextComponent(0, "Welcome to your new portfolio", "h1", newPortfolio._id)

    const textComponent = await createTextComponent(1, "You can add components from left menu", "text", newPortfolio._id)

    await PortfolioModel
        .findOneAndUpdate(
            {url: url},
            {title: title, description: description, components: [titleComponent._id, textComponent._id]},
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
                throw new ApiError(500, "Error creating version");
            }))
        }).catch((err) => {
            console.log("Error creating version", err)
            throw new ApiError(500, "Error creating portfolio");
        })
}


async function getPortfoliosByUserId(userId: string) {
    return PortfolioModel.find({user: userId});
}


function getComponentUpdatesAndRemovals(previousComponents: Component[], currentComponents: Component[]): IChange[] {
    const changes: IChange[] = [];
    for (const prevComponent of previousComponents) {
        const currentComponent = currentComponents.find(
            (component) => component.componentId === prevComponent.componentId
        );


        if (!currentComponent) {
            // Component was removed
            changes.push({
                type: ChangeType.REMOVE,
                message: `Component ${prevComponent.componentId} was removed.`,
            });
        } else {

            if (currentComponent.__t === "ContainerComponent") {
                // Manage container components


                // @ts-ignore
                const containerComponentAdditions = getComponentAdditions(prevComponent.components, currentComponent.components)

                // @ts-ignore
                const containerComponentUpdatesAndRemovals = getComponentUpdatesAndRemovals(prevComponent.components, currentComponent.components);

                const allContainerChanges = [...containerComponentAdditions, ...containerComponentUpdatesAndRemovals]
                changes.push({
                    type: ChangeType.UPDATE,
                    message: `Changes to ContainerComponent ${currentComponent.componentId}: ${allContainerChanges.map((change) => change.message).join("\n")}`
                })

                continue;
            }

            // Compare fields to detect changes
            const allKeys = Object.keys(prevComponent);
            const keysToRemove = ["_id", "createdAt", "updatedAt", "__v", "$__", "_doc", "$isNew", "__t", "parent_id"];
            const keys = allKeys.filter(key => !keysToRemove.includes(key));

            for (const key of keys) {
                // @ts-ignore

                // @ts-ignore
                if (prevComponent[key]?.toString() !== currentComponent[key]?.toString() && currentComponent[key] !== undefined) {
                    changes.push({
                        type: ChangeType.UPDATE,
                        // @ts-ignore
                        message: `${currentComponent.__t} ${currentComponent.componentId} changed its ${key} from "${prevComponent[key]}" to "${currentComponent[key]}".`,
                    });
                }
            }
        }
    }
    return changes;
}

function getComponentAdditions(previousComponents: Component[], currentComponents: Component[]): IChange[] {
    const changes: IChange[] = [];

    for (const currentComponent of currentComponents) {
        if (!previousComponents.find((component) => component.componentId === currentComponent.componentId)) {
            // Check if a ContainerComponent with children was added
            // @ts-ignore
            if (currentComponent.__t === "ContainerComponent" && currentComponent.components.length != 0) {
                // @ts-ignore
                const containerComponentChanges = getComponentAdditions([], currentComponent.components)
                const containerComponentChangesMessages = containerComponentChanges.map((change) => change.message).join(", ")
                changes.push({
                    type: ChangeType.ADD,
                    message: `ContainerComponent ${currentComponent.componentId} was added: ${containerComponentChangesMessages}`
                })
            } else {

                changes.push({
                    type: ChangeType.ADD,
                    message: `${currentComponent.__t} ${currentComponent.componentId} was added.`,
                });
            }
        }
    }
    return changes;
}


function getComponentChanges(previousComponents: Component[], currentComponents: Component[]): IChange[] {
    const changes: IChange[] = [];

    // Detect additions
    const componentAdditions = getComponentAdditions(previousComponents, currentComponents);
    changes.push(...componentAdditions);

    // Detect changes and removals
    const updateAndRemovalChanges = getComponentUpdatesAndRemovals(previousComponents, currentComponents);
    changes.push(...updateAndRemovalChanges);

    return changes;
}


async function getPortfolioChanges(prevPortfolio: Portfolio, newPortfolio: Portfolio): Promise<IChange[]> {
    const changes: IChange[] = [];

    // Check portfolio attributes
    if (prevPortfolio.title !== newPortfolio.title) {
        changes.push({
            type: ChangeType.UPDATE,
            message: `Portfolio title changed from "${prevPortfolio.title}" to "${newPortfolio.title}".`,
        });
    }

    if (prevPortfolio.description !== newPortfolio.description) {
        changes.push({
            type: ChangeType.UPDATE,
            message: `Portfolio description changed from "${prevPortfolio.description}" to "${newPortfolio.description}".`,
        });
    }

    if (prevPortfolio.url !== newPortfolio.url) {
        changes.push({
            type: ChangeType.UPDATE,
            message: `Portfolio url changed from "${prevPortfolio.url}" to "${newPortfolio.url}".`,
        });
    }


    const componentChanges = getComponentChanges(prevPortfolio.components, newPortfolio.components);
    changes.push(...componentChanges);


    return changes;
}


async function getPorfolioByUrl(url: string) {
    return PortfolioModel.findOne({url: url})
        .populate({
            path: "components",
            populate: {
                path: "components",
            }
        });

}

async function removePortfolioByUrl(url: string) {
    const portfolio = await PortfolioModel.findOne({url: url});

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
    }

    try {
        await PortfolioModel.deleteOne({url: url})
        await VersionModel.deleteMany({portfolioId: portfolio._id})
        await removeOrphanComponents()
    } catch (error) {
        console.log("Error deleting portfolio", error)
        throw new ApiError(500, "Error deleting portfolio");
    }
}

async function restorePortfolio(version: IVersion, components: any) {
    return PortfolioModel
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
        });

}


export {
    createPortfolio,
    getPortfolioChanges,
    createInitialPortfolio,
    getPortfoliosByUserId,
    getPorfolioByUrl,
    removePortfolioByUrl,
    restorePortfolio
}