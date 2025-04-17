import IPortfolio from "../interfaces/IPortfolio";
import {PortfolioModel, VersionModel} from "../models";
import Component from "../interfaces/component";
import {ChangeType, IChange} from "../interfaces/IChange";
import ApiError from "../interfaces/ApiError";

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
            const allKeys = Object.keys(prevComponent.toObject());
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


async function getPortfolioChanges(prevPortfolio: IPortfolio, newPortfolio: IPortfolio): Promise<IChange[]> {
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

async function createVersion(
    prevPortfolio: IPortfolio,
    newPortfolio: IPortfolio,
) {

    const changes = await getPortfolioChanges(prevPortfolio, newPortfolio)
    return await VersionModel.create({
        portfolioId: newPortfolio._id,
        changes: changes,
        components: newPortfolio.components,
        title: newPortfolio.title,
        description: newPortfolio.description,
        url: newPortfolio.url,
    }).then((version) => {
        return version;
    })
}

function componentsAreEquals(componentA: any, componentB: any): boolean {
    if (!componentA || !componentB) {
        return false; // One of the components is null or undefined
    }

    // Combine keys from both components
    const allKeys = new Set([...Object.keys(componentA), ...Object.keys(componentB)]);

    // Keys to not compare
    const keysToRemove = ["_id", "createdAt", "updatedAt", "__v", "$__", "_doc", "$isNew"];

    // Filter out the keys to remove
    const keys = [...allKeys].filter(key => !keysToRemove.includes(key));

    for (const key of keys) {
        if (componentA[key]?.toString() !== componentB[key]?.toString()) {
            return false;
        }
    }

    return true;
}

export {
    createPortfolio,
    getPortfolioChanges,
    createVersion,
    componentsAreEquals
}