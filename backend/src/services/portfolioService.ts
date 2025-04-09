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


async function getPortfolioChanges(portfolio: Portfolio): Promise<IChange[]> {
    const changes: IChange[] = [];


    // Fetch the previous version of the portfolio
    const previousVersion = await versionModel
        .findOne({portfolioId: portfolio._id})
        .sort({createdAt: -1}) // Assuming versions are timestamped
        .lean();

    console.log(previousVersion);

    if (!previousVersion) {
        throw new Error(`No previous version found for portfolio ID ${portfolio._id}.`);
    }

    const currentComponents = portfolio.components || [];
    // @ts-ignore
    const previousComponents: Component[] = previousVersion.components || [];

    // Map components by their IDs for easier comparison
    const currentComponentsMap = new Map(
        currentComponents.map((component) => [component._id.toString(), component])
    );
    const previousComponentsMap = new Map(
        previousComponents.map((component: Component) => [component._id.toString(), component])
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
            for (const key of Object.keys(prevComponent)) {
                if (key === "_id" || key === "createdAt") continue; // Skip _id comparison

                // @ts-ignore
                console.log(prevComponent[key], currentComponent[key])
                console.log("\n")
                // @ts-ignore
                if (prevComponent[key] !== currentComponent[key] && currentComponent[key] !== undefined) {
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
    portfolio: Portfolio,
) {

    const changes = await getPortfolioChanges(portfolio)
    console.log("Changes: ", changes)
    const populatedComponents = JSON.parse(JSON.stringify(portfolio.components));
    return await versionModel.create({
        portfolioId: portfolio._id,
        changes: changes,
        components: populatedComponents,
        title: portfolio.title,
        description: portfolio.description,
        url: portfolio.url,
    }).then((version) => {
        return version;
    })
}

export {
    createPortfolio,
    getPortfolioChanges,
    createVersion
}