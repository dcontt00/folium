import mongoose from "mongoose";
import TextType from "@/interfaces/TextType";
import TextComponent from "@/classes/components/TextComponent";


const TextComponentSchema = new mongoose.Schema(
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
            enum: TextType,
            default: "text",
        },
        fontSize: {
            type: Number,
            default: 0,
        }

    },
    {timestamps: true}
)

TextComponentSchema.loadClass(TextComponent);

export default TextComponentSchema;