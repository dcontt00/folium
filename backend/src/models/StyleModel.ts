import mongoose from "mongoose";
import StyleSchema from "../schemas/StyleSchema";

const styleModel = mongoose.model('Style', StyleSchema);

export default styleModel;