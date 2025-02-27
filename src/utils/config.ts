import {Config} from "../interfaces/Config";

let config: Config;

config = {
    BACKEND_SECRET: process.env.BACKEND_SECRET || "secret",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017"
};

export default config;