import mongoose from "mongoose";
import ImageComponent from "@/classes/components/ImageComponent";


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
    },
    {timestamps: true}
)

ImageComponentSchema.loadClass(ImageComponent);

export default ImageComponentSchema;