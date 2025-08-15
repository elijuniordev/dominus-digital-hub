// backend/lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js';
import config from '../config.js'; // Importa a configuração centralizada

// Usa as variáveis já validadas do objeto de configuração
const supabaseServerClient = createClient(config.supabaseUrl!, config.supabaseServiceKey!);

export default supabaseServerClient;