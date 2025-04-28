import mongoose from "mongoose";

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

export default StyleSchema;