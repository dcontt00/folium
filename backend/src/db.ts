import mongoose from "mongoose";
import config from "@/utils/config";

const connectDB = async () => {
    try {
        return await mongoose.connect(config.MONGODB_URI, {});
    } catch (error) {
    }
};

export default connectDB;