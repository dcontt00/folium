import mongoose from "mongoose";

const StyleSchema = new mongoose.Schema(
    {
        classes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "StyleClass",
            }
        ]
    },
    {timestamps: true}
);

export default StyleSchema;