import {VersionModel} from "@/models";
import mongoose from "mongoose";


async function getVersionById(id: string,) {
    return VersionModel.findById(id);
}

async function deleteOlderVersions(portfolioId: mongoose.Types.ObjectId, date: any) {
    return VersionModel.deleteMany({
        portfolioId: portfolioId,
        createdAt: {$gt: date}
    });
}

export {
    getVersionById,
    deleteOlderVersions,
}