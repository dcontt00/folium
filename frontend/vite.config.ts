import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path, {resolve} from 'node:path'

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
