import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
   server: {
      proxy: {
         '/uploads': {
            target: process.env.VITE_API_URL || 'http://localhost:8080',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/uploads/, '/uploads'),
         },
      },
   },
   plugins: [react(), eslint()],
});
