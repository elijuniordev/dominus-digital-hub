import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Qualquer requisição que comece com /api...
      '/api': {
        // ...será redirecionada para o seu backend
        target: 'http://localhost:3000', 
        // Muda a 'origem' da requisição para o endereço do backend
        changeOrigin: true,
        // CORREÇÃO: Remove o prefixo /api da requisição antes de enviá-la
        // para o backend. Isso garante que /api/public/blog chegue como /public/blog
        // no servidor Express. Se o seu servidor Express espera o /api, remova esta linha.
        // Com base na sua configuração, esta linha NÃO é necessária.
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})