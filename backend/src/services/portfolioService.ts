import Portfolio from "../interfaces/portfolio";
import {portfolioModel, versionModel} from "../models/models";
import Component from "../interfaces/component";
import {ChangeType, IChange} from "../interfaces/IChange";

// Create portfolio
async function createPortfolio(
    portfolio: Portfolio,
    userId: string
) {
    return await portfolioModel.create({
        ...portfolio,
        userId,
    }).then((portfolio) => {
        return portfolio;
    })
}


function getComponentUpdatesAndRemovals() {

}

function getComponentChanges(previousComponents: Component[], currentComponents: Component[]): IChange[] {
    const changes: IChange[] = [];
    // Map components by their ComponentIds for easier comparison


    if (previousComponents.length === 0) {
        changes.push({
            type: ChangeType.ADD,
            message: `ContainerComponent added some components`,
        });

        return changes;
    }


    // Detect changes and removals
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
            // Compare fields to detect changes
            const allKeys = Object.keys(prevComponent.toObject());
            const keysToRemove = ["_id", "createdAt", "updatedAt", "__v", "$__", "_doc", "$isNew", "__t"];
            const keys = allKeys.filter(key => !keysToRemove.includes(key));

            for (const key of keys) {
                // @ts-ignore
                console.log(key, prevComponent[key], currentComponent[key])

                // @ts-ignore
                if (prevComponent[key]?.toString() !== currentComponent[key]?.toString() && currentComponent[key] !== undefined) {

                    // TODO: Modify message for container
                    if (currentComponent.__t === "ContainerComponent") {
                        // @ts-ignore
                        const containerComponentChanges = getComponentChanges(prevComponent.components, currentComponent.components)
                        const containerComponentChangesMessages = containerComponentChanges.map((change) => change.message).join(", ")
                        changes.push({
                            type: ChangeType.UPDATE,
                            message: `ContainerComponent ${currentComponent.componentId} changed: ${containerComponentChangesMessages}`
                        })
                    } else {
                        changes.push({
                            type: ChangeType.UPDATE,
                            // @ts-ignore
                            message: `Component ${currentComponent.componentId} changed its ${key} from "${prevComponent[key]}" to "${currentComponent[key]}".`,
                        });
                    }
                }
            }
        }
    }

    // Detect additions
    for (const currentComponent of currentComponents) {
        if (previousComponents.find((component) => component.componentId === currentComponent.componentId)) {
            if (currentComponent.__t === "ContainerComponent") {
                // @ts-ignore
                const containerComponentChanges = getComponentChanges([], currComponent.components)
                const containerComponentChangesMessages = containerComponentChanges.map((change) => change.message).join(", ")
                changes.push({
                    type: ChangeType.ADD,
                    message: `ContainerComponent ${currentComponent.componentId} was added: ${containerComponentChangesMessages}`
                })
            }
            changes.push({
                type: ChangeType.ADD,
                message: `Component ${currentComponent.componentId} was added.`,
            });
        }
    }
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

async function createVersion(
    prevPortfolio: Portfolio,
    newPortfolio: Portfolio,
) {

    const changes = await getPortfolioChanges(prevPortfolio, newPortfolio)
    return await versionModel.create({
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