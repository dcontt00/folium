import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 1234,
        host: true,
        watch: {
            usePolling: true,
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                edit: path.resolve(__dirname, 'edit/index.html'),
                home: path.resolve(__dirname, 'home/index.html'),
                login: path.resolve(__dirname, 'login/index.html'),
                view: path.resolve(__dirname, 'view/index.html'),
                register: path.resolve(__dirname, 'register/index.html'),
                githubCallback: path.resolve(__dirname, 'github-callback/index.html'),
                profile: path.resolve(__dirname, 'profile/index.html'),
            }
        },
    },
})
;