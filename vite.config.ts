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
  // ADICIONE ESTE BLOCO DE CÓDIGO
  server: {
    proxy: {
      // Qualquer requisição que comece com /api será redirecionada
      '/api': {
        target: 'http://localhost:3000', // O endereço do seu backend
        changeOrigin: true, // Necessário para o redirecionamento funcionar
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Mantém o /api no caminho final
      },
    },
  },
})