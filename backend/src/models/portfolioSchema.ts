import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        components: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Component",
            },
        ],
        versions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Version",
            },
        ],
    },
    {timestamps: true}
);

export default PortfolioSchema;