import {VersionModel} from "@/models";
import mongoose from "mongoose";
import {getComponentAdditions, getComponentUpdatesAndRemovals, getPortfolioChanges} from "@/services/portfolioService";
import {Portfolio} from "@/classes";
import Changes from "@/classes/Changes";
import styleModel from "@/models/StyleModel";


async function getVersionById(id: string,) {
    return VersionModel.findById(id);
}

async function deleteOlderVersions(portfolioId: mongoose.Types.ObjectId, date: any) {
    return VersionModel.deleteMany({
        portfolioId: portfolioId,
        createdAt: {$gt: date}
    });
}

async function createVersion(
    prevPortfolio: Portfolio,
    newPortfolio: Portfolio,
) {

    const changes2 = new Changes();

    await getPortfolioChanges(prevPortfolio, newPortfolio, changes2)
    getComponentAdditions(prevPortfolio.components, newPortfolio.components, changes2);
    const prevStyle = await styleModel.findById(prevPortfolio.style).populate("classes").lean();
    const currentStyle = await styleModel.findById(newPortfolio.style).populate("classes").lean();

    // Detect changes and removals
    // @ts-ignore
    await getComponentUpdatesAndRemovals(prevPortfolio.components, newPortfolio.components, prevStyle, currentStyle, changes2);

    return await VersionModel.create({
        portfolioId: newPortfolio._id,
        changes: changes2.toJSON(),
        components: newPortfolio.components,
        description: newPortfolio.description,
        url: newPortfolio.url,
        title: newPortfolio.title,
        style: newPortfolio.style,
    }).then((version) => {
        return version;
    })
}

async function getVersionsByPortfolioId(portfolioId: string) {
    return VersionModel
        .find({portfolioId: portfolioId})
        .sort({createdAt: -1});

}

export {
    getVersionById,
    deleteOlderVersions,
    createVersion,
    getVersionsByPortfolioId
}