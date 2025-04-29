import mongoose from "mongoose";
import Style from "@/classes/Style";

const StyleSchema = new mongoose.Schema(
    {
        classes: {
            type: Map,
            of: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "StyleClass",
            },
            default: {},
        },
    },
    {timestamps: true}
);

StyleSchema.loadClass(Style);
export default StyleSchema;