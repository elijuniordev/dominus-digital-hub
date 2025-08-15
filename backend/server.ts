// O config.ts DEVE ser o primeiro a ser importado.
import config from './config.js';

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

const app = express();
const PORT = config.port;

// --- CONFIGURAÇÃO DE CORS DEFINITIVA ---
const allowedOrigins = [
  'http://localhost:5173', // Seu frontend em desenvolvimento
  // Adicione aqui a URL do seu site em produção quando tiver uma
  // 'https://www.seudominio.com' 
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos que o frontend pode enviar
};

// Aplica o middleware de CORS a todas as rotas
app.use(cors(corsOptions));

// Middleware para parsing de JSON
app.use(express.json());


// --- ROTAS DA API ---

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


// --- ROTA PADRÃO E ERROR HANDLER ---
app.get('/', (req: Request, res: Response) => res.send('API da Dominus Digital Hub está operacional!'));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERRO NÃO TRATADO]:', err.stack);
  res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(PORT, () => {
  console.log(`--- SUCESSO! Servidor completo iniciado em http://localhost:${PORT} ---`);
});