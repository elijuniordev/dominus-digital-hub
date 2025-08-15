console.log('[DEBUG] Carregando: lib/supabase-server.ts');

import { createClient } from '@supabase/supabase-js';
import config from '../config.js';

// Cria uma única instância do cliente Supabase para ser usada em todo o backend.
const supabaseServerClient = createClient(config.supabaseUrl!, config.supabaseServiceKey!);

export default supabaseServerClient;