import vue from '@vitejs/plugin-vue';
import {defineConfig} from 'vite';
import string from 'vite-plugin-string';

export default defineConfig({
    plugins: [
        vue(),
        string({
            include: [
                '**/*.vert',
                '**/*.frag',
                '**/*.obj',
            ],
            compress: false,
        }),
    ],
    build: {
        outDir: '../server/public'
    }
});
