import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
// ADICIONADO: Importa nosso cliente Supabase centralizado com a extensão .js
import supabaseServerClient from '../../lib/supabase-server.js';

// REMOVIDO: Toda a inicialização local do Supabase foi retirada.

const router = Router();

/**
 * @route GET /api/admin/clients
 * @description Lista todos os clientes com seus dados principais e contratos.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // ALTERADO: Usando o cliente centralizado
    const { data, error } = await supabaseServerClient
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
 */
router.post('/', async (req: Request, res: Response) => {
  const { full_name, business_name, email, phone, services, billing_day } = req.body;

  if (!full_name || !email || !services || !billing_day) {
    return res.status(400).json({ error: "Nome, e-mail, serviços e dia de cobrança são obrigatórios." });
  }

  let createdUserId: string | null = null;

  try {
    // ALTERADO: Usando o cliente centralizado
    const { data: authData, error: authError } = await supabaseServerClient.auth.admin.createUser({
      email,
      password: uuidv4(),
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erro ao criar a autenticação do usuário.');
    }
    createdUserId = authData.user.id;
    
    // ALTERADO: Usando o cliente centralizado
    const { error: userError } = await supabaseServerClient
      .from('users')
      .insert({ id: createdUserId, email: email, role: 'client' });
    
    if (userError) {
      console.warn(`Aviso ao inserir na tabela users: ${userError.message}`);
    }

    const miniSiteUrl = (business_name || full_name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // ALTERADO: Usando o cliente centralizado
    const { data: clientInfo, error: clientInfoError } = await supabaseServerClient
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

    if (services && services.length > 0) {
      const contractsToInsert = services.map((serviceId: string) => ({
        client_id: clientId,
        service_id: serviceId,
        billing_day: billing_day,
        status: 'active',
      }));

      // ALTERADO: Usando o cliente centralizado
      const { error: contractsError } = await supabaseServerClient
        .from('contracts')
        .insert(contractsToInsert);

      if (contractsError) {
        throw new Error(`Erro ao criar contratos: ${contractsError.message}`);
      }
    }

    res.status(201).json({ message: 'Cliente e contratos criados com sucesso!', clientId: clientId });

  } catch (error) {
    if (createdUserId) {
      // ALTERADO: Usando o cliente centralizado
      await supabaseServerClient.auth.admin.deleteUser(createdUserId);
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
        // ALTERADO: Usando o cliente centralizado
        const { data, error } = await supabaseServerClient
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
 * @description Exclui um cliente e seus dados associados.
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // ALTERADO: Usando o cliente centralizado
        const { data: clientInfo, error: fetchError } = await supabaseServerClient
            .from('clients_info')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !clientInfo) {
            throw new Error('Cliente não encontrado.');
        }

        const { user_id } = clientInfo;

        // ALTERADO: Usando o cliente centralizado
        const { error: deleteError } = await supabaseServerClient.auth.admin.deleteUser(user_id);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        res.status(204).send();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao excluir cliente.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;