import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

export const apiClient = axios.create({
  baseURL: '/', // Correto para funcionar com o proxy
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