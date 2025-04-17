import mongoose from "mongoose";
import IVersion from "@/interfaces/IVersion";
import versionSchema from "@/schemas/VersionSchema";

const VersionModel = mongoose.model<IVersion>('Version', versionSchema);

export default VersionModel;