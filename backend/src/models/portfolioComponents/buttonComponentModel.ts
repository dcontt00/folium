import mongoose from "mongoose";
import componentModel from "./componentModel";


const buttonComponentModel = componentModel.discriminator("ButtonComponent", new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: "#000000",
        },

        // Url to navigate on click
        url: {
            type: String,
            required: true,
        }
    }
))

export default buttonComponentModel;