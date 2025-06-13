import {ComponentModel, VersionModel} from "@/models";
import mongoose from "mongoose";
import {
    getComponentAdditions,
    getComponentUpdatesAndRemovals,
    getPortfolioChanges,
    restorePortfolio
} from "@/services/portfolioService";
import {ApiError, Portfolio} from "@/classes";
import Changes from "@/classes/Changes";
import styleModel from "@/models/StyleModel";
import Component from "@/classes/components/Component";
import {IPortfolio, IServiceResult} from "@/interfaces";


async function getVersion(versionId: string, restore: boolean): Promise<IServiceResult> {
    const version = await getVersionById(versionId)

    if (version == null) {
        throw new ApiError(404, "Version not found");
    }

    const components: Component[] = await ComponentModel.find({_id: {$in: version.components}})
    const style = await styleModel
        .findById(version.style)
        .populate("classes")

    if (restore) {
        const restoredPortfolio = await restorePortfolio(version, components, style)
        await deleteOlderVersions(version.portfolioId, version.createdAt)

        return {
            status: 200,
            success: true,
            data: restoredPortfolio,
        }


    } else {
        const portfolio: IPortfolio = {
            _id: version.portfolioId,
            title: version.title,
            description: version.description,
            url: version.url,
            components: components,
            // @ts-ignore
            style: style,
        }
        return {
            status: 200,
            success: true,
            data: portfolio,
        };
    }
}

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

async function createFirstVersion(portfolio: Portfolio) {

    const changes = new Changes()
    changes.setPortfolioCreated(true)
    await VersionModel.create(
        {
            portfolioId: portfolio._id,
            changes: changes.toJSON(),
            components: portfolio.components,
            title: portfolio.title,
            description: portfolio.description,
            url: portfolio.url,
            style: portfolio.style,
        }
    ).then(() => {
    }).catch((err => {
        console.log("Error creating version", err)
        throw new ApiError(500, "Error creating version");
    }))
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
    getVersionsByPortfolioId,
    createFirstVersion,
    getVersion
}