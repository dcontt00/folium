import mongoose from "mongoose";

const textComponentSchema = new mongoose.Schema(
    {
        index: {
            type: mongoose.Schema.Types.Int32,
            required: true,
        },
        portfolio_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        text: {
            type: String,
            required: true,
        }

    },
    {timestamps: true}
);

export default textComponentSchema;