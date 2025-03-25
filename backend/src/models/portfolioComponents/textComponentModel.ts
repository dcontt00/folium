import mongoose from "mongoose";
import componentModel from "./componentModel";

const textComponentModel = componentModel.discriminator("TextComponent", new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        // If the text is bold, italic, etc.
        style: {
            type: String,
            enum: ["normal", "bold", "italic"],
            default: "normal",
        },
        type: {
            type: String,
            enum: ["h1", "h2", "h3", "h4", "h5", "h6", "text"],
            default: "text",
        },
        fontSize: {
            type: Number,
            default: 16,
        }

    },
    {timestamps: true}
));

export default textComponentModel;