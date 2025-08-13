// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Adiciona a configuração de proxy
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL e porta do seu servidor de backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove o prefixo '/api'
      },
    },
    port: 5173,
  },
});