// backend/api/admin/clients.ts
import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Inicialização segura do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('As variáveis de ambiente do Supabase não estão configuradas no backend.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- ROTAS DA API PARA CLIENTES ---

/**
 * @route GET /api/admin/clients
 * @description Lista todos os clientes com seus dados principais e contratos.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('clients_info')
      .select(`
        id,
        full_name,
        business_name,
        phone,
        mini_site_url,
        users ( email, role ),
        contracts (
          id,
          status,
          monthly_total,
          services ( name )
        )
      `);

    if (error) {
      throw error;
    }

    // Mapeia os dados para um formato mais amigável para o frontend
    const clientsData = data.map(client => {
      const user = Array.isArray(client.users) ? client.users[0] : client.users;
      return {
        id: client.id,
        full_name: client.full_name,
        business_name: client.business_name,
        phone: client.phone,
        mini_site_url: client.mini_site_url,
        email: user?.email,
        role: user?.role,
        contracts: client.contracts || [],
      };
    });

    res.status(200).json(clientsData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar clientes.';
    console.error('Erro na rota GET /api/admin/clients:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});


/**
 * @route POST /api/admin/clients
 * @description Cadastra um novo cliente, seu usuário no Auth, e seus contratos iniciais.
 * @body { full_name, business_name, email, phone, services (array de IDs), billing_day }
 */
router.post('/', async (req: Request, res: Response) => {
  const { full_name, business_name, email, phone, services, billing_day } = req.body;

  if (!full_name || !email || !services || !billing_day) {
    return res.status(400).json({ error: "Nome, e-mail, serviços e dia de cobrança são obrigatórios." });
  }

  let createdUserId: string | null = null;

  try {
    // Passo 1: Criar o usuário no Supabase Auth usando a chave de admin
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: uuidv4(), // Gera uma senha inicial forte e aleatória
      email_confirm: true, // O admin já confirma o e-mail
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erro ao criar a autenticação do usuário.');
    }
    createdUserId = authData.user.id;
    
    // Passo 2 (Opcional, mas recomendado): Inserir na tabela 'public.users'
    // Se você não tiver um trigger, este passo é necessário.
    const { error: userError } = await supabase
      .from('users')
      .insert({ id: createdUserId, email: email, role: 'client' });
    
    if (userError) {
      // Se a inserção falhar (ex: por um trigger que já fez o trabalho), podemos ignorar ou logar.
      console.warn(`Aviso ao inserir na tabela users: ${userError.message}`);
    }

    // Passo 3: Criar a entrada na tabela 'clients_info'
    const miniSiteUrl = (business_name || full_name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const { data: clientInfo, error: clientInfoError } = await supabase
      .from('clients_info')
      .insert({
        user_id: createdUserId,
        full_name,
        business_name,
        phone,
        activation_key: uuidv4(),
        mini_site_url: miniSiteUrl,
      })
      .select('id')
      .single();

    if (clientInfoError || !clientInfo) {
      throw new Error(clientInfoError?.message || 'Erro ao salvar informações do cliente.');
    }
    const clientId = clientInfo.id;

    // Passo 4: Criar os contratos para os serviços selecionados
    if (services && services.length > 0) {
      const contractsToInsert = services.map((serviceId: string) => ({
        client_id: clientId,
        service_id: serviceId,
        billing_day: billing_day,
        status: 'active',
      }));

      const { error: contractsError } = await supabase
        .from('contracts')
        .insert(contractsToInsert);

      if (contractsError) {
        throw new Error(`Erro ao criar contratos: ${contractsError.message}`);
      }
    }

    res.status(201).json({ message: 'Cliente e contratos criados com sucesso!', clientId: clientId });

  } catch (error) {
    // Se qualquer passo falhar, deleta o usuário criado no Auth para manter a consistência (rollback)
    if (createdUserId) {
      await supabase.auth.admin.deleteUser(createdUserId);
    }
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no cadastro de cliente.';
    console.error('Erro detalhado:', error);
    res.status(500).json({ error: errorMessage });
  }
});


/**
 * @route PUT /api/admin/clients/:id
 * @description Atualiza as informações de um cliente.
 */
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { full_name, business_name, phone, notes } = req.body;

    try {
        const { data, error } = await supabase
            .from('clients_info')
            .update({ full_name, business_name, phone, notes })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar cliente.';
        res.status(500).json({ error: errorMessage });
    }
});


/**
 * @route DELETE /api/admin/clients/:id
 * @description Exclui um cliente e seus dados associados (via cascade do DB).
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Primeiro, obtemos o user_id associado ao client_id para poder deletar do Auth
        const { data: clientInfo, error: fetchError } = await supabase
            .from('clients_info')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !clientInfo) {
            throw new Error('Cliente não encontrado.');
        }

        const { user_id } = clientInfo;

        // Deleta o usuário do Supabase Auth, o que deve deletar em cascata
        // as outras informações graças às políticas ON DELETE CASCADE do seu SQL.
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        res.status(204).send(); // 204 No Content para sucesso na exclusão
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao excluir cliente.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;