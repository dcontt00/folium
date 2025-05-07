import {VersionModel} from "@/models";
import mongoose from "mongoose";
import {getPortfolioChanges} from "@/services/portfolioService";
import {Portfolio} from "@/classes";
import Changes from "@/classes/Changes";


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

    const changes = await getPortfolioChanges(prevPortfolio, newPortfolio, changes2)
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