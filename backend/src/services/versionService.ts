import {VersionModel} from "@/models";
import mongoose from "mongoose";
import IPortfolio from "../interfaces/IPortfolio";
import {getPortfolioChanges} from "@/services/portfolioService";


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