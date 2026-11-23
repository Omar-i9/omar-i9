import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: { input: { home: resolve(process.cwd(), 'index.html'), taamen: resolve(process.cwd(), 'projects/taamen.html'), notFound: resolve(process.cwd(), '404.html') } }
  },
  server: { host: '0.0.0.0', port: 4173, strictPort: true }
});
