import mongoose from "mongoose";
import componentModel from "./componentModel";

const imageComponentModel = componentModel.discriminator("ImageComponent", new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
        },
        overlayText: {
            type: String,
        }
    },
    {timestamps: true}
));

export default imageComponentModel;