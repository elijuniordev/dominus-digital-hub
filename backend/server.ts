// backend/server.ts
import express from 'express';
import cors from 'cors';
import clientsRouter from './api/admin/client';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
}));
app.use(express.json());

// Rotas da API
app.use('/api/admin', clientsRouter);

// Rota de teste para a API
app.get('/api', (req, res) => {
  res.send('API da Dominus Digital rodando!');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor de backend rodando em http://localhost:${PORT}`);
});