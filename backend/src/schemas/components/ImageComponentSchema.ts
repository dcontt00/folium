import mongoose from "mongoose";


const ImageComponentSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
        },
        overlayText: {
            type: String,
        },
        overlayTransparency: {
            type: Number,
            default: 0.5,
            min: 0,
            max: 1,
        },
        width: {
            type: Number,
            default: 1,
        }
    },
    {timestamps: true}
)

export default ImageComponentSchema;