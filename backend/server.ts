import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importações dos roteadores de administração
import blogRouter from './api/admin/blog';
import clientsRouter from './api/admin/clients';
import dashboardRouter from './api/admin/dashboard';
import ordersRouter from './api/admin/orders';
import physicalOrdersRouter from './api/admin/physical_orders';
import servicesAdminRouter from './api/admin/services';

// Importações dos roteadores públicos e do cliente
import publicServicesRouter from './api/public/services';
import activationRouter from './api/public/activation';
import clientDashboardRouter from './api/client/dashboard';
// CORRIGIDO: Assumindo que client/orders tem um router e que a exportação não é padrão
import { clientOrdersRouter } from './api/client/orders'; 

// Importa o middleware de autenticação
import { authMiddleware } from './api/middleware/auth'; // CORRIGIDO: Importação nomeada

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Rotas da API para o painel de administrador (protegidas com authMiddleware)
app.use('/api/admin/blog', authMiddleware, blogRouter);
app.use('/api/admin/clients', authMiddleware, clientsRouter);
app.use('/api/admin/dashboard', authMiddleware, dashboardRouter);
app.use('/api/admin/orders', authMiddleware, ordersRouter);
app.use('/api/admin/physical_orders', authMiddleware, physicalOrdersRouter);
app.use('/api/admin/services', authMiddleware, servicesAdminRouter);

// Rotas da API do Cliente (protegidas com authMiddleware)
app.use('/api/client/dashboard', authMiddleware, clientDashboardRouter);
app.use('/api/client/orders', authMiddleware, clientOrdersRouter);

// Rotas da API Pública (sem proteção)
app.use('/api/public/activation', activationRouter);
app.use('/api/services', publicServicesRouter);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API da Dominus Digital Hub está operacional!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});