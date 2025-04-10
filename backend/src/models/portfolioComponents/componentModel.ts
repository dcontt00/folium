import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema(
    {
        componentId: {
            type: Number,
            default: () => Math.floor(Math.random() * 1000000), // Autogenerate a random number
        },
        index: {
            type: mongoose.Schema.Types.Int32,
            required: true,
        },
        parent_id: { // Indicates the portfolio or container component this component belongs to
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    {timestamps: true}
);


const componentModel = mongoose.model('Component', ComponentSchema);

export default componentModel;