import mongoose from "mongoose";
import componentModel from "./componentModel";
import ButtonComponent from "../../classes/ButtonComponent";


const buttonComponentSchema = new mongoose.Schema(
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
)

buttonComponentSchema.loadClass(ButtonComponent)

const buttonComponentModel = componentModel.discriminator("ButtonComponent", buttonComponentSchema)

export default buttonComponentModel;