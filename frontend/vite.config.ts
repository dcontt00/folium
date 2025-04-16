import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import {resolve} from 'node:path'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    define: {
        'import.meta.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)
    },
    server: {
        port: 3000,
        host: true,
        watch: {
            usePolling: true,
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                chart: resolve(__dirname, 'login/index.html'),
                allData: resolve(__dirname, 'register/index.html'),

            },
        },
    },

});
