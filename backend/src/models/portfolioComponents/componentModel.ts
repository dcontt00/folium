import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema(
    {
        index: {
            type: mongoose.Schema.Types.Int32,
            required: true,
        },
        portfolio_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    {timestamps: true}
);


const componentModel = mongoose.model('Component', ComponentSchema);

export default componentModel;