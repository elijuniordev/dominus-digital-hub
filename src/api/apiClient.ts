import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

// Usando 'export const' para criar uma exportação nomeada, que é mais robusta contra erros de cache.
export const apiClient = axios.create({
  baseURL: '/', // A baseURL é relativa, o proxy do Vite configurado no vite.config.ts cuida do resto.
});

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