import {Portfolio} from "../interfaces/portfolio";
import {portfolioModel, versionModel} from "../models/models";


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

async function getVersionDifferences(portfolioId: string) {
    const versions = await versionModel.find({portfolioId}).sort({createdAt: 1});

    const differences = [];
    for (let i = 1; i < versions.length; i++) {
        const prevVersion = versions[i - 1];
        const currentVersion = versions[i];
        const diff = getDifferences(prevVersion.data, currentVersion.data);
        differences.push({from: prevVersion._id, to: currentVersion._id, diff});
    }

    return differences;
}

function getDifferences(obj1: any, obj2: any): any {
    const diff: any = {};

    // Check for modified or deleted keys
    for (const key in obj1) {
        if (!(key in obj2)) {
            diff[key] = {status: "deleted", old: obj1[key], new: null};
        } else if (obj1[key] !== obj2[key]) {
            diff[key] = {status: "modified", old: obj1[key], new: obj2[key]};
        }
    }

    // Check for added keys
    for (const key in obj2) {
        if (!(key in obj1)) {
            diff[key] = {status: "added", old: null, new: obj2[key]};
        }
    }

    return diff;
}

export {
    createPortfolio,
    getVersionDifferences,
}