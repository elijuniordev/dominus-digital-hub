import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env para process.env
dotenv.config();

// Valida as variáveis essenciais e as exporta
const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
  port: process.env.PORT || 3001,
};

// Verifica se alguma variável essencial está faltando
if (!config.supabaseUrl || !config.supabaseServiceKey || !config.supabaseJwtSecret) {
  console.error("ERRO: Variáveis de ambiente essenciais do Supabase não foram definidas.");
  console.error("Verifique se o arquivo .env existe na pasta /backend e contém SUPABASE_URL, SUPABASE_SERVICE_KEY, e SUPABASE_JWT_SECRET.");
  process.exit(1); // Encerra a aplicação com um código de erro
}

export default config;