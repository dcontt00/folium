import mongoose from "mongoose";

const buttonComponentSchema = new mongoose.Schema(
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
        color: {
            type: String,
            default: "#000000",
        },

        // Url to navigate on click
        url: {
            type: String,
            required: true,
        }

    },
    {timestamps: true}
);

export default buttonComponentSchema;