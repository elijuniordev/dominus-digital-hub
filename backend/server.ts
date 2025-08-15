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
import { authenticateToken } from './api/middleware/auth.js';

const app = express();
const PORT = config.port;

// Middlewares
const allowedOrigins = [ 'http://localhost:5173', 'https://www.seudominio.com' ];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso não permitido por CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());

// Rotas da API
app.use('/api/admin/blog', authenticateToken, blogRouter);
app.use('/api/admin/clients', authenticateToken, clientsRouter);
app.use('/api/admin/dashboard', authenticateToken, dashboardRouter);
app.use('/api/admin/orders', authenticateToken, ordersRouter);
app.use('/api/admin/physical_orders', authenticateToken, physicalOrdersRouter);
app.use('/api/admin/services', authenticateToken, servicesAdminRouter);
app.use('/api/client/dashboard', authenticateToken, clientDashboardRouter);
app.use('/api/public/activation', activationRouter);
app.use('/api/services', publicServicesRouter);

// Rota Padrão e Error Handler
app.get('/', (req, res) => res.send('API da Dominus Digital Hub está operacional!'));

app.use((err, req, res, next) => {
  console.error('[ERRO NÃO TRATADO]:', err.stack);
  res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado com sucesso em http://localhost:${PORT}`);
});