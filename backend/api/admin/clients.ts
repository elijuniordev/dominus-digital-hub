// backend/api/admin/clients.ts
import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---------------------- GET CLIENTES ----------------------
router.get('/', async (req: Request, res: Response) => {
  try {
    // Busca clientes
    const { data: clientsData, error } = await supabase
      .from('clients_info')
      .select(`
        id,
        full_name,
        business_name,
        phone,
        user_id,
        contracts (
          id,
          status,
          monthly_total,
          billing_day,
          services (
            id,
            name,
            type
          )
        )
      `);

    if (error) throw error;

    // Buscar emails dos usuários
    const userIds = clientsData.map((c) => c.user_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .in('id', userIds);

    if (usersError) throw usersError;

    // Combinar email com dados do cliente
    const clientsWithEmails = clientsData.map((client) => ({
      ...client,
      email: usersData.find((user) => user.id === client.user_id)?.email || '',
      services: client.contracts
        ?.map((c: { services?: { name: string }[] }) =>
          c.services?.map((s: { name: string }) => s.name).join(', ')
        )
        .join(', ') || '',
      monthly_total: client.contracts?.reduce((acc: number, c: { monthly_total?: number }) => acc + (c.monthly_total || 0), 0) || 0,
      status: client.contracts?.[0]?.status || 'inactive',
    }));

    res.status(200).json(clientsWithEmails);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro ao listar clientes:', msg);
    res.status(500).json({ error: msg });
  }
});

// ---------------------- POST CLIENTE ----------------------
router.post('/', async (req: Request, res: Response) => {
  const { full_name, business_name, email, phone, billing_day, services } = req.body;

  if (!full_name || !email || !services?.length) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  try {
    // Cria usuário via Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'Senha123!', // senha temporária
      email_confirm: true,
    });

    if (authError || !authData) throw new Error(authError?.message || 'Erro ao criar usuário.');
    const userId = authData.user.id;

    // Atualiza role do usuário
    const { error: roleError } = await supabase.from('users').update({ role: 'client' }).eq('id', userId);
    if (roleError) throw new Error(roleError.message);

    // Insere dados do cliente
    const { data: clientInfo, error: clientInfoError } = await supabase
      .from('clients_info')
      .insert({
        user_id: userId,
        full_name,
        business_name,
        phone,
        activation_key: crypto.randomUUID(),
        mini_site_url: business_name?.toLowerCase().replace(/ /g, '-') || '',
      })
      .select('id');

    if (clientInfoError || !clientInfo?.length) throw new Error(clientInfoError?.message || 'Erro ao inserir cliente.');
    const clientId = clientInfo[0].id;

    // Insere contratos
    const contractsToInsert = services.map((serviceId: string) => ({
      client_id: clientId,
      service_id: serviceId,
      billing_day,
      status: 'active',
    }));

    const { error: contractsError } = await supabase.from('contracts').insert(contractsToInsert);
    if (contractsError) throw new Error(contractsError.message);

    res.status(200).json({ message: 'Cliente e contratos criados com sucesso!' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao cadastrar cliente:', msg);
    res.status(500).json({ error: msg });
  }
});

export default router;
