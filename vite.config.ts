// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Configura o proxy para redirecionar as chamadas de API para o backend
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL e porta do seu servidor de backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove o prefixo '/api'
      },
    },
  },
});