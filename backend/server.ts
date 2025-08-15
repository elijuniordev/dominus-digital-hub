import config from './config.js';
import express from 'express';
import cors from 'cors';
// ... (todas as suas importações de rotas)
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

// --- CONFIGURAÇÃO DE CORS EXPLÍCITA ---
const allowedOrigins = [
  'http://localhost:5173', // Permite o acesso do seu frontend
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Aplica o CORS a todas as requisições
app.use(cors(corsOptions));

app.use(express.json());

// --- ROTAS DA API ---
// (o restante das suas rotas permanece igual)
app.use('/api/admin/blog', authenticateToken, blogRouter);
app.use('/api/admin/clients', authenticateToken, clientsRouter);
app.use('/api/admin/dashboard', authenticateToken, dashboardRouter);
app.use('/api/admin/orders', authenticateToken, ordersRouter);
app.use('/api/admin/physical_orders', authenticateToken, physicalOrdersRouter);
app.use('/api/admin/services', authenticateToken, servicesAdminRouter);
app.use('/api/client/dashboard', authenticateToken, clientDashboardRouter);
app.use('/api/client/orders', authenticateToken, clientOrdersRouter);
app.use('/api/public/activation', activationRouter);
app.use('/api/services', publicServicesRouter);
app.use('/api/public/blog', publicBlogRouter);


app.get('/', (req, res) => res.send('API da Dominus Digital Hub está operacional!'));

app.use((err, req, res, next) => {
  console.error('[ERRO NÃO TRATADO]:', err.stack);
  res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(PORT, () => {
  console.log(`--- SUCESSO! Servidor completo iniciado em http://localhost:${PORT} ---`);
});