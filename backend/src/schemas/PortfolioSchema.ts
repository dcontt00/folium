import mongoose from "mongoose";
import {Portfolio} from "@/classes";

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
        style: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Style",
            required: true,
        }
    },
    {timestamps: true}
);

PortfolioSchema.loadClass(Portfolio);

export default PortfolioSchema;