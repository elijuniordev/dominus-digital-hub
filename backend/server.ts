// O config.ts DEVE ser o primeiro a ser importado.
import config from './config.js';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Importações de rotas com a extensão .js OBRIGATÓRIA
import blogRouter from './api/admin/blog.js';
import clientsRouter from './api/admin/clients.js';
import dashboardRouter from './api/admin/dashboard.js';
import ordersRouter from './api/admin/orders.js';
import physicalOrdersRouter from './api/admin/physical_orders.js';
import servicesAdminRouter from './api/admin/services.js';
import publicServicesRouter from './api/public/services.js';
import activationRouter from './api/public/activation.js';
import clientDashboardRouter from './api/client/dashboard.js';
import publicBlogRouter from './api/public/blog.js';
// CORRIGIDO: O nome do arquivo é 'order.js' (singular)
import clientOrdersRouter from './api/client/order.js'; 
import { authenticateToken } from './api/middleware/auth.js';

const app = express();
const PORT = config.port;

// Middlewares
const allowedOrigins = [ 'http://localhost:5173', 'https://www.seudominio.com' ];
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

// --- Rotas da API (TODAS ATIVADAS) ---

// Rotas de Administrador (Protegidas)
app.use('/api/admin/blog', authenticateToken, blogRouter);
app.use('/api/admin/clients', authenticateToken, clientsRouter);
app.use('/api/admin/dashboard', authenticateToken, dashboardRouter);
app.use('/api/admin/orders', authenticateToken, ordersRouter);
app.use('/api/admin/physical_orders', authenticateToken, physicalOrdersRouter);
app.use('/api/admin/services', authenticateToken, servicesAdminRouter);

// Rotas de Cliente (Protegidas)
app.use('/api/client/dashboard', authenticateToken, clientDashboardRouter);
app.use('/api/client/orders', authenticateToken, clientOrdersRouter);

// Rotas Públicas (Abertas)
app.use('/api/public/activation', activationRouter);
app.use('/api/services', publicServicesRouter);
app.use('/api/public/blog', publicBlogRouter);

// Rota Padrão e Error Handler
app.get('/', (req: Request, res: Response) => res.send('API da Dominus Digital Hub está operacional!'));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERRO NÃO TRATADO]:', err.stack);
  res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(PORT, () => {
  console.log(`--- SUCESSO! Servidor completo iniciado em http://localhost:${PORT} ---`);
});