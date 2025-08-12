import {resolve} from 'path'
import {defineConfig} from 'vite';

export default defineConfig({
    root: './',
    build: {
        outDir: "./dist",
        emptyOutDir: true,
        cssCodeSplit: true,
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
                    if (/\.woff2?$/.test(name ?? '')) {
                        return 'assets/fonts/[name][extname]';
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
                checkout: resolve('', 'checkout.html'),
                thanks: resolve('', 'thanks.html'),
                shop: resolve('', 'shop.html'),
                contact: resolve('', 'contact.html'),
                'commercial-solutions': resolve('', 'commercial-solutions.html'),
                pages: resolve('', 'pages.html'),
                faq: resolve('', 'faq.html'),
            },
        }
    },
    server: {
        port: 3000,
        open: true
    },
    preview: {
        port: 4173,
        open: true
    }
});
