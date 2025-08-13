// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientsRouter from './api/admin/clients';
import servicesRouter from './api/admin/services';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Rotas da API
// Agora cada router tem seu próprio caminho consistente
app.use('/api/admin/clients', clientsRouter);     // Para clientes
app.use('/api/admin/services', servicesRouter);   // Para serviços

app.get('/', (req, res) => {
  res.send('API da Dominus Digital rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor de backend rodando em http://localhost:${PORT}`);
});
