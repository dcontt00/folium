import type {Config} from "./interfaces/Config";

let config: Config;


if (import.meta.env.PROD) {
    config = {
        BACKEND_URL: "/api",
        GH_OAUTH_CLIENT_ID: import.meta.env.VITE_GH_OAUTH_CLIENT_ID,
    };
} else {

    config = {
        BACKEND_URL: "http://localhost:3000/api",
        GH_OAUTH_CLIENT_ID: import.meta.env.VITE_GH_OAUTH_CLIENT_ID,
    };
}
export default config;