import path from "path"
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // CONFIGURAÇÃO DO SERVIDOR DE DESENVOLVIMENTO
  server: {
    // Define a porta do frontend (opcional, o padrão é 5173)
    port: 5173, 
    // CONFIGURAÇÃO DO PROXY (A PARTE CRÍTICA)
    proxy: {
      // Qualquer requisição no frontend que comece com /api...
      '/api': {
        // ...será redirecionada para o seu backend
        target: 'http://localhost:3000', 
        // Muda a 'origem' da requisição para o endereço do backend (essencial)
        changeOrigin: true,
      },
    },
  },
})