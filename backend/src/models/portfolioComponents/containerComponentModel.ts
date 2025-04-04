import mongoose from "mongoose";
import componentModel from "./componentModel";


interface IContainerComponent extends Document {
    index: number;
    components: mongoose.Types.ObjectId[];
    portfolio_id: mongoose.Types.ObjectId;
}

const containerComponentModel = componentModel.discriminator<IContainerComponent>("ContainerComponent", new mongoose.Schema(
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

export default containerComponentModel;