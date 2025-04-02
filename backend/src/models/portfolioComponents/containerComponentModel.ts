import mongoose from "mongoose";
import componentModel from "./componentModel";

const textComponentModel = componentModel.discriminator("ContainerComponent", new mongoose.Schema(
    {
        components: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Component",
            },
        ],
    },
    {timestamps: true}
));

export default textComponentModel;