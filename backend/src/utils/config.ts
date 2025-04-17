import {Config} from "@/interfaces/Config";
import {configDotenv} from "dotenv";

let config: Config;

// Load environment variables from .env file
configDotenv();

config = {
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017"
};

export default config;