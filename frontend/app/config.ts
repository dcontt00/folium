import type {Config} from "./interfaces/Config";

let config: Config;


if (import.meta.env.PROD) {
    config = {
        BACKEND_URL: "http://localhost:3000",
    };
} else {

    config = {
        BACKEND_URL: "http://localhost:3000",
    };
}

export default config;