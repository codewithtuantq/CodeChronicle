import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { watchAndRun } from 'vite-plugin-watch-and-run';
import path from 'path';

function stripUseClient() {
  return {
    name: 'strip-use-client',
    setup(build) {
      build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
        const fs = await import('fs/promises')
        let source = await fs.readFile(args.path, 'utf8')
        // remove "use client";
        source = source.replace(/["']use client["'];?/g, '')
        return { contents: source, loader: args.path.endsWith('.tsx') ? 'tsx' : 'js' }
      })
    },
  }
}

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/prezet.css',
                'resources/js/app.js',
                'resources/js/app.tsx',
            ],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        watchAndRun([
            {
                name: 'prezet:index',
                watch: path.resolve('prezet/**/*.(md|jpg|png|webp)'),
                run: 'php artisan prezet:index',
                delay: 1000,
            },
        ]),
    ],
    optimizeDeps: {
        esbuildOptions: {
            plugins: [stripUseClient()],
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});
