import mongoose from "mongoose";
import {IVersion} from "@/interfaces";
import {VersionSchema} from "@/schemas";

const VersionModel = mongoose.model<IVersion>('Version', VersionSchema);

export default VersionModel;