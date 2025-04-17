import mongoose from "mongoose";
import Portfolio from "@/classes/Portfolio";

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

PortfolioSchema.loadClass(Portfolio);

export default PortfolioSchema;