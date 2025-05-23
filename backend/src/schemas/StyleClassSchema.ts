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
        width: {
            type: String,
        },
        imageOverlayTransparency: {
            type: String,
            min: 0,
            max: 1,
        },
        flexDirection: {
            type: String,
            enum: ["row", "column"],
        },
        alignItems: {
            type: String,
            enum: ["flex-start", "flex-end", "center", "baseline", "stretch"],

        },
        justifyContent: {
            type: String,
            enum: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
        },
        marginTop: {
            type: String,
        },
        textAlign: {
            type: String,
            enum: ["left", "right", "center", "justify"],
        },
        fontSize: {
            type: String,
        },
        position: {
            type: String,
            enum: ["absolute", "relative", "fixed", "sticky", "static"],
        },
        top: {
            type: String,
        },
        left: {
            type: String,
        },
        right: {
            type: String,
        },
        bottom: {
            type: String,
        },
        border: {
            type: String,
        },
        padding: {
            type: String,
        },
        transition: {
            type: String,
        },
        transform: {
            type: String,
        },
        cursor: {
            type: String,
        },
        borderRadius: {
            type: String,
        },
        gap: {
            type: String,
        },
        color: {
            type: String,
        }

    },
    {timestamps: true}
);
StyleClassSchema.loadClass(StyleClass);

export default StyleClassSchema;