import mongoose from "mongoose";

const StyleSchema = new mongoose.Schema(
    {
        textFont: {
            type: String,
            default: "Arial",
        },
        backgroudColor: {
            type: String,
            default: "#FFFFFF",
        },
        display: {
            type: String,
            default: "block"
        },

    },
    {timestamps: true}
);

export default StyleSchema;