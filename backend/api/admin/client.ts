// backend/api/admin/clients.ts
import { createClient } from '@supabase/supabase-js';
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  calculate_monthly_total,
  update_monthly_totals
} from '../functions/billing'; // Supondo que essas funções estão em um arquivo separado.

const router = Router();

// Configure o Supabase com a Service Role Key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Rota GET para listar clientes e seus serviços
router.get('/clients', async (req, res) => {
  const { data: clientsData, error } = await supabase
    .from('clients_info')
    .select(`
      id,
      full_name,
      business_name,
      phone,
      contracts(id, status, monthly_total, billing_day, services(name, type))
    `);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Obter emails dos usuários
  const userIds = clientsData.map(client => client.user_id);
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, email')
    .in('id', userIds);

  if (usersError) {
    return res.status(500).json({ error: usersError.message });
  }

  const clientsWithEmails = clientsData.map(client => ({
    ...client,
    email: usersData.find(user => user.id === client.user_id)?.email,
  }));

  res.status(200).json(clientsWithEmails);
});

// Rota POST para cadastrar um novo cliente
router.post('/clients', async (req, res) => {
  const { full_name, business_name, email, phone, billing_day, services } = req.body;

  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: uuidv4(), // Senha temporária aleatória
    });

    if (authError) {
      throw new Error(authError.message);
    }
    const userId = authData.user.id;

    // 2. Atualizar perfil para 'client'
    await supabase
      .from('users')
      .update({ role: 'client' })
      .eq('id', userId);

    // 3. Criar registro na tabela clients_info
    const { data: clientInfo, error: clientInfoError } = await supabase
      .from('clients_info')
      .insert({
        user_id: userId,
        full_name,
        business_name,
        phone,
        activation_key: uuidv4(),
        mini_site_url: business_name.toLowerCase().replace(/ /g, '-'),
      })
      .select('id');

    if (clientInfoError) {
      throw new Error(clientInfoError.message);
    }
    const clientId = clientInfo[0].id;

    // 4. Criar contratos para cada serviço
    const contractsToInsert = services.map(serviceId => ({
      client_id: clientId,
      service_id: serviceId,
      billing_day,
      status: 'active',
      // O valor será calculado por um trigger no banco de dados
    }));

    const { error: contractsError } = await supabase
      .from('contracts')
      .insert(contractsToInsert);

    if (contractsError) {
      throw new Error(contractsError.message);
    }

    res.status(200).json({ message: 'Cliente e contratos criados com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default router;