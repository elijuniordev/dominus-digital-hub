import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

// A baseURL agora é simplesmente '/'. As chamadas serão relativas
// (ex: /api/public/blog) e o proxy do Vite fará o resto.
const apiClient = axios.create({
  baseURL: '/',
});

// O interceptor de autenticação continua igual, garantindo que o token seja enviado.
apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;