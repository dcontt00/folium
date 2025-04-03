import {reactRouter} from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";


export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    define: {
        'import.meta.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)
    },

});
