import mongoose from "mongoose";
import config from "@/utils/config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI, {});
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;