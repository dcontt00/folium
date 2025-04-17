import mongoose from "mongoose";
import {StyleSchema} from "@/schemas";

const styleModel = mongoose.model('Style', StyleSchema);

export default styleModel;