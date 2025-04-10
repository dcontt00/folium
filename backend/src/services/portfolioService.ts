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


async function getPortfolioChanges(prevPortfolio: Portfolio, newPortfolio: Portfolio): Promise<IChange[]> {
    const changes: IChange[] = [];

    const currentComponents = newPortfolio.components || [];
    // @ts-ignore
    const previousComponents: Component[] = prevPortfolio.components || [];

    // Map components by their ComponentIds for easier comparison
    const currentComponentsMap = new Map(
        currentComponents.map((component) => [component.componentId, component])
    );
    const previousComponentsMap = new Map(
        previousComponents.map((component: Component) => [component.componentId, component])
    );


    // Detect changes and removals
    for (const [id, prevComponent] of previousComponentsMap.entries()) {
        const currentComponent = currentComponentsMap.get(id);

        if (!currentComponent) {
            // Component was removed
            changes.push({
                type: ChangeType.REMOVE,
                message: `Component ${id} was removed.`,
            });
        } else {
            // Compare fields to detect changes
            const allKeys = Object.keys(prevComponent.toObject());
            const keysToRemove = ["_id", "createdAt", "updatedAt", "__v", "$__", "_doc", "$isNew", "__t"];
            const keys = allKeys.filter(key => !keysToRemove.includes(key));

            for (const key of keys) {
                // @ts-ignore

                // @ts-ignore
                if (prevComponent[key]?.toString() !== currentComponent[key]?.toString() && currentComponent[key] !== undefined) {
                    changes.push({
                        type: ChangeType.UPDATE,
                        // @ts-ignore
                        message: `Component ${id} changed its ${key} from "${prevComponent[key]}" to "${currentComponent[key]}".`,
                    });
                }
            }
        }
    }

    // Detect additions
    for (const [id, currComponent] of currentComponentsMap.entries()) {
        if (!previousComponentsMap.has(id)) {
            changes.push({
                type: ChangeType.ADD,
                message: `Component ${id} was added.`,
            });
        }
    }

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