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
    // Proxy para redirecionar requisições /api para o backend
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL do seu servidor de backend
        changeOrigin: true,        
      },
    },
    port: 5173,
  },
});