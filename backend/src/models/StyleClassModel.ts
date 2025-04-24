import mongoose from "mongoose";
import {StyleClassSchema} from "@/schemas";

const styleClassModel = mongoose.model('StyleClass', StyleClassSchema);

export default styleClassModel;