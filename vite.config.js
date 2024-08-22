import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        vuetify({ autoImport: true })
    ],
    resolve: {

        alias: {
            '@': resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
        port: 3000,
    },
    define: {
        'process.env': {},
        'process.env.VERSION': JSON.stringify(process.env.VERSION || 'unknown'),
    },
});
