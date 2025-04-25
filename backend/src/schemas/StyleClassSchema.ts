import mongoose from "mongoose";

const StyleClassSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
        },
        textFont: {
            type: String,
            default: "Arial",
        },
        backgroudColor: {
            type: String,
            default: "#242424",
        },
        display: {
            type: String,
            default: "block"
        },

    },
    {timestamps: true}
);

export default StyleClassSchema;