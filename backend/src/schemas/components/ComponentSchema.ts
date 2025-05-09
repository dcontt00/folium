import mongoose from "mongoose";
import Component from "@/classes/components/Component";

const ComponentSchema = new mongoose.Schema(
    {
        componentId: {
            type: Number,
            default: () => Math.floor(Math.random() * 1000000), // Autogenerate a random number
        },
        className: {
            type: String,
            required: true,
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

ComponentSchema.loadClass(Component)

export default ComponentSchema;