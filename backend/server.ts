import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importações dos roteadores
import clientsRouter from './api/admin/clients';
import servicesRouter from './api/admin/services';
import dashboardRouter from './api/admin/dashboard';
import ordersRouter from './api/admin/orders'; // Garante que está importando 'orders.ts'
import blogRouter from './api/admin/blog';
import blogHelpersRouter from './api/admin/blog_helpers';
import activationRouter from './api/public/activation';
import clientDashboardRouter from './api/client/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API para o painel de administrador
app.use('/api/admin/clients', clientsRouter);
app.use('/api/admin/services', servicesRouter);
app.use('/api/admin/dashboard', dashboardRouter);
app.use('/api/admin/orders', ordersRouter);
app.use('/api/admin/blog', blogRouter);
app.use('/api/admin/helpers', blogHelpersRouter);

// Rotas da API Pública
app.use('/api/public', activationRouter); // <--- 2. Use a nova rota pública

// Rotas da API do Cliente (Protegidas)
app.use('/api/client', clientDashboardRouter); // <--- 2. Use a nova rota

app.get('/', (req, res) => {
  res.send('API da Dominus Digital Hub está operacional!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});