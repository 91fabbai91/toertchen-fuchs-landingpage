import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteImageOptimizer({
      webp: { quality: 80 },
      avif: { quality: 75 },
      png: { quality: 80 },
      jpeg: { quality: 80 },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        recipe: resolve(import.meta.dirname, 'recipe.html'),
      },
    },
  },
});
