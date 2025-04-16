import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";


export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    define: {
        'import.meta.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)
    },

});
