import mongoose from "mongoose";

const textComponentSchema = new mongoose.Schema(
    {
        //////////// Base component attributes
        index: {
            type: mongoose.Schema.Types.Int32,
            required: true,
        },
        portfolio_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        //////////// Text component attributes
        text: {
            type: String,
            required: true,
        },
        // If the text is bold, italic, etc.
        style: {
            type: String,
            default: "normal",
        }

    },
    {timestamps: true}
);

export default textComponentSchema;