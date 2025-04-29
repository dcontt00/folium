import mongoose from "mongoose";
import StyleClass from "@/classes/StyleClass";

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
        backgroundColor: {
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
StyleClassSchema.loadClass(StyleClass);

export default StyleClassSchema;