import axios from 'axios';

// Garante que a URL base da API seja a do back-end
const API_URL = import.meta.env.VITE_API_URL; 

if (!API_URL) {
  throw new Error("A variável de ambiente VITE_API_URL não está definida no arquivo .env");
}

const apiClient = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;