import path from "path"
import react from "@vitejs/plugin-react-swc" // Usando o plugin swc
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // CONFIGURAÇÃO DO SERVIDOR DE DESENVOLVIMENTO COM PROXY
  server: {
    proxy: {
      // Qualquer requisição no frontend que comece com /api...
      '/api': {
        // ...será redirecionada para o seu backend na porta 3000
        target: 'http://localhost:3000', 
        changeOrigin: true, // Essencial para o proxy funcionar
      },
    },
  },
})