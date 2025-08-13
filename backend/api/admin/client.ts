// backend/api/admin/clients.ts
import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rota GET para listar clientes e seus serviços
router.get('/clients', async (req: Request, res: Response) => {
  const { data: clientsData, error } = await supabase
    .from('clients_info')
    .select(`
      id,
      full_name,
      business_name,
      phone,
      user_id,
      contracts(id, status, monthly_total, billing_day, services(id, name, type))
    `);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

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
router.post('/clients', async (req: Request, res: Response) => {
  const { full_name, business_name, email, phone, billing_day, services } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: uuidv4(), // Senha temporária aleatória
    });

    if (authError || !authData.user) {
      throw new Error(authError ? authError.message : 'Erro desconhecido de autenticação');
    }
    const userId = authData.user.id;

    await supabase
      .from('users')
      .update({ role: 'client' })
      .eq('id', userId);

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

    if (clientInfoError || !clientInfo) {
      throw new Error(clientInfoError.message);
    }
    const clientId = clientInfo[0].id;

    const contractsToInsert = services.map((serviceId: string) => ({
      client_id: clientId,
      service_id: serviceId,
      billing_day,
      status: 'active',
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