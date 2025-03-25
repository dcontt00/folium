import mongoose from "mongoose";
import componentModel from "./componentModel";

const imageComponentModel = componentModel.discriminator("ImageComponent", new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
));

export default imageComponentModel;