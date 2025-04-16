import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from 'node:path'

export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: true,
        watch: {
            usePolling: true,
        },
    },

});
