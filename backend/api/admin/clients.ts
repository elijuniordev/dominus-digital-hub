import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rota GET para listar clientes
router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('clients_info')
    .select(`
      id,
      full_name,
      business_name,
      phone,
      mini_site_url,
      users(email)
    `);

  if (error) {
    console.error('Erro ao buscar clientes:', error);
    return res.status(500).json({ error: error.message });
  }

  // Mapeia os dados para incluir o email diretamente na resposta
  const clientsWithEmail = data.map(client => ({
    ...client,
    email: Array.isArray(client.users) && client.users.length > 0 ? client.users[0].email : null,
    users: undefined
  }));

  res.status(200).json(clientsWithEmail);
});

// Rota POST para cadastrar um novo cliente
router.post('/', async (req: Request, res: Response) => {
  const { full_name, business_name, email, phone, billing_day, services } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: uuidv4(),
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erro ao criar usuário.');
    }
    const userId = authData.user.id;

    const { error: updateUserError } = await supabase
      .from('users')
      .update({ role: 'client' })
      .eq('id', userId);

    if (updateUserError) {
      throw new Error(updateUserError.message);
    }

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
      throw new Error(clientInfoError?.message || 'Erro ao criar informações do cliente.');
    }
    const clientId = clientInfo[0].id;

    if (services && services.length > 0) {
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
    }

    res.status(200).json({ message: 'Cliente e contratos criados com sucesso!' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
    console.error('Erro ao cadastrar cliente:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;