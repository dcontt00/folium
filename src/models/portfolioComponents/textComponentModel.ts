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
            default: "normal",
        }

    },
    {timestamps: true}
));

export default textComponentModel;