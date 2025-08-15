// backend/server.ts

// Carrega as variáveis de ambiente do arquivo .env
import 'dotenv/config'; 

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Importações de rotas
import blogRouter from './api/admin/blog.js';
import clientsRouter from './api/admin/clients.js';
import dashboardRouter from './api/admin/dashboard.js';
import ordersRouter from './api/admin/orders.js';
import physicalOrdersRouter from './api/admin/physical_orders.js';
import servicesAdminRouter from './api/admin/services.js';
import publicServicesRouter from './api/public/services.js';
import activationRouter from './api/public/activation.js';
import clientDashboardRouter from './api/client/dashboard.js';
import clientOrdersRouter from './api/client/order.js';
import { authenticateToken } from './api/middleware/auth.js';
import publicBlogRouter from './api/public/blog.js';

// backend/server.ts

// ... imports (não é necessário alterá-los)

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`[BACKEND]: Requisição recebida: ${req.method} ${req.originalUrl}`);
  next();
});

// Configuração do CORS
// Para testar, use uma configuração mais restritiva para evitar problemas
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5173', // Permita apenas a origem do seu front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors());
app.use(express.json());

// Rotas da API (CORRIGIDO)
// Agora todas as rotas públicas também têm o prefixo '/api'
app.use('/api/admin/blog', authenticateToken, blogRouter);
app.use('/api/admin/clients', authenticateToken, clientsRouter);
app.use('/api/admin/dashboard', authenticateToken, dashboardRouter);
app.use('/api/admin/orders', authenticateToken, ordersRouter);
app.use('/api/admin/physical_orders', authenticateToken, physicalOrdersRouter);
app.use('/api/admin/services', authenticateToken, servicesAdminRouter);
app.use('/api/client/dashboard', authenticateToken, clientDashboardRouter);
app.use('/api/client/orders', authenticateToken, clientOrdersRouter);

app.use('/api/public/activation', activationRouter);
app.use('/api/public/services', publicServicesRouter);
app.use('/api/public/blog', publicBlogRouter);

// ... o restante do seu código

app.listen(PORT, () => {
  console.log(`--- SUCESSO! Servidor completo iniciado em http://localhost:${PORT} ---`);
});

// Rota Padrão e Error Handler
app.get('/', (req: Request, res: Response) => res.send('API da Dominus Digital Hub está operacional!'));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERRO NÃO TRATADO]:', err.stack);
  res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(PORT, () => {
  console.log(`--- SUCESSO! Servidor completo iniciado em http://localhost:${PORT} ---`);
});