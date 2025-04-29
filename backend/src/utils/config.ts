import {Config} from "@/interfaces";
import {configDotenv} from "dotenv";

let config: Config;

// Load environment variables from .env file
configDotenv();

config = {
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://192.168.0.14:27017",
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID || "your-client-id",
    GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET || "your-client-secret",
};

export default config;