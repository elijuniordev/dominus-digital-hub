import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

const apiService = axios.create({
  baseURL: '/',
});

apiService.interceptors.request.use(
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

export default apiService;