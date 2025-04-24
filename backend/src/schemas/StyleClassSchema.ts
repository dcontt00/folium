import mongoose from "mongoose";

const StyleClassSchema = new mongoose.Schema(
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

export default StyleClassSchema;