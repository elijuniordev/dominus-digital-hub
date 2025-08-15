console.log('[DEBUG] Carregando: config.ts'); 

import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

// Valida as variáveis essenciais e as exporta
const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
  port: process.env.PORT || 3001,
};

// Se alguma variável essencial estiver faltando, o servidor irá parar com uma mensagem clara.
if (!config.supabaseUrl || !config.supabaseServiceKey || !config.supabaseJwtSecret) {
  console.error("ERRO CRÍTICO: Variáveis de ambiente do Supabase não definidas.");
  console.error("Verifique se o arquivo .env existe na pasta /backend e contém as chaves necessárias.");
  process.exit(1); // Encerra a aplicação
}

export default config;