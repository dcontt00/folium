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
        },
        display: {
            type: String,
        },
        imageWidth: {
            type: Number,
        },
        imageOverlayTransparency: {
            type: Number,
            min: 0,
            max: 1,
        },
        buttonColor: {
            type: String,
        }

    },
    {timestamps: true}
);
StyleClassSchema.loadClass(StyleClass);

export default StyleClassSchema;