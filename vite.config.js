import {resolve} from 'path'
import {defineConfig} from 'vite';

export default defineConfig({
    root: './',
    build: {
        outDir: "./dist",
        emptyOutDir: true,
        define: {
            'require': 'window.require',
        },
        rollupOptions: {
            output: {
                entryFileNames: "assets/js/[name].js",
                chunkFileNames: "assets/js/[name].js",
                assetFileNames: ({name}) => {
                    if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
                        return 'assets/images/[name][extname]';
                    }
                    if (/\.css$/.test(name ?? '')) {
                        return 'assets/css/[name][extname]';
                    }
                    if (/\.mp4$/.test(name ?? '')) {
                        return 'videos/[name][extname]';
                    }
                    if (/\.ttf$/.test(name ?? '')) {
                        return 'assets/fonts/[name][extname]';
                    }
                    if (/\.ttf$/.test(name ?? '')) {
                        return 'fonts/[name][extname]';
                    }

                    // default value
                    // ref: https://rollupjs.org/guide/en/#outputassetfilenames
                    return '[name][extname]';
                }
            },
            input: {
                main: resolve('', 'index.html'),
                blog: resolve('', 'blog.html'),
                article: resolve('', 'article.html'),
                product: resolve('', 'product.html'),
                cart: resolve('', 'cart.html'),
                checkout: resolve('', 'checkout.html')
            },
        }
    },
});