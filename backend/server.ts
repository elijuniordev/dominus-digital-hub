// O ARQUIVO DE CONFIGURAÇÃO DEVE SER O PRIMEIRO A SER IMPORTADO
// Ele carrega e valida as variáveis de ambiente antes de qualquer outro código.
import config from './config.js';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Imports dos roteadores com a extensão .js, como requerido por ES Modules
import blogRouter from './api/admin/blog.js';
import clientsRouter from './api/admin/clients.js';
import dashboardRouter from './api/admin/dashboard.js';
import ordersRouter from './api/admin/orders.js';
import physicalOrdersRouter from './api/admin/physical_orders.js';
import servicesAdminRouter from './api/admin/services.js';
import publicServicesRouter from './api/public/services.js';
import activationRouter from './api/public/activation.js';
import clientDashboardRouter from './api/client/dashboard.js';

// Opcional: Rota de pedidos do cliente (se o arquivo existir)
// import clientOrdersRouter from './api/client/orders.js'; 

// Importa o middleware de autenticação com o nome correto
import { authenticateToken } from './api/middleware/auth.js';

const app = express();
// Usa a porta a partir do nosso arquivo de configuração centralizado
const PORT = config.port;

// --- Middlewares ---
const allowedOrigins = [
  'http://localhost:5173', // Endereço do seu frontend em desenvolvimento
  'https://www.seudominio.com' // TODO: Mude para o seu domínio em produção
];
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso não permitido por CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Rotas da API ---

// Rotas de Administrador (Protegidas)
app.use('/api/admin/blog', authenticateToken, blogRouter);
app.use('/api/admin/clients', authenticateToken, clientsRouter);
app.use('/api/admin/dashboard', authenticateToken, dashboardRouter);
app.use('/api/admin/orders', authenticateToken, ordersRouter);
app.use('/api/admin/physical_orders', authenticateToken, physicalOrdersRouter);
app.use('/api/admin/services', authenticateToken, servicesAdminRouter);

// Rotas de Cliente (Protegidas)
app.use('/api/client/dashboard', authenticateToken, clientDashboardRouter);
// app.use('/api/client/orders', authenticateToken, clientOrdersRouter); // Descomente quando o arquivo 'orders.ts' do cliente for criado

// Rotas Públicas (Abertas)
app.use('/api/public/activation', activationRouter);
app.use('/api/services', publicServicesRouter);

// --- Rotas Finais e Inicialização ---

app.get('/', (req: Request, res: Response) => {
  res.send('API da Dominus Digital Hub está operacional!');
});

// Middleware de tratamento de erros centralizado
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERRO NÃO TRATADO]:', err.stack);
  res.status(500).json({ 
    error: 'Ocorreu um erro inesperado no servidor.' 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});