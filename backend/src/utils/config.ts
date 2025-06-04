import {Config} from "@/interfaces";
import {configDotenv} from "dotenv";

let config: Config;

// Load environment variables from .env file
configDotenv();

config = {
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
    GH_OAUTH_CLIENT_ID: process.env.GH_OAUTH_CLIENT_ID || "your-client-id",
    GH_OAUTH_CLIENT_SECRET: process.env.GH_OAUTH_CLIENT_SECRET || "your-client-secret",
};
export default config;