import mongoose from "mongoose";
import {ButtonComponent} from "@/classes";

const buttonComponentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        // Url to navigate on click
        url: {
            type: String,
            required: true,
        }
    }
)

buttonComponentSchema.loadClass(ButtonComponent)

export default buttonComponentSchema;