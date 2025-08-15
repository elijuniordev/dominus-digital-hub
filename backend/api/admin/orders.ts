import { Router, Request, Response } from 'express';
// ADICIONADO: Importa nosso cliente Supabase centralizado.
import supabaseServerClient from '../../lib/supabase-server.js';

// REMOVIDO: A inicialização local do Supabase foi retirada.

const router = Router();

// A rota GET para listar todos os pedidos
router.get('/', async (req: Request, res: Response) => {
  try {
    // ALTERADO: Usando o cliente centralizado
    const { data, error } = await supabaseServerClient
      .from('orders')
      .select(`id, created_at, order_status, tracking_code, clients_info!inner ( full_name ), services!inner ( name )`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar pedidos.';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route POST /api/admin/orders
 * @description Cria uma nova ordem, agora aceitando um status inicial.
 */
router.post('/', async (req: Request, res: Response) => {
    const { client_id, service_id, order_status } = req.body; // Recebe o status do frontend
    if (!client_id || !service_id) {
        return res.status(400).json({ error: 'ID do cliente e serviço são obrigatórios.' });
    }
    try {
        // ALTERADO: Usando o cliente centralizado
        const { data, error } = await supabaseServerClient.from('orders')
            .insert({
                client_id,
                service_id,
                order_status: order_status || 'pending', // Usa o status recebido ou 'pending' como padrão
            })
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao criar pedido.';
        res.status(500).json({ error: errorMessage });
    }
});

// A rota PUT para atualizar um pedido
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { order_status, tracking_code } = req.body;
    const updateData: { order_status?: string, tracking_code?: string } = {};
    if (order_status) updateData.order_status = order_status;
    if (tracking_code !== undefined) updateData.tracking_code = tracking_code;
    if (Object.keys(updateData).length === 0) return res.status(400).json({ error: 'Nenhum dado para atualização.' });
    try {
        // ALTERADO: Usando o cliente centralizado
        const { data, error } = await supabaseServerClient.from('orders').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar pedido.';
        res.status(500).json({ error: errorMessage });
    }
});

/**
 * @route DELETE /api/admin/orders/:id
 * @description Exclui uma ordem do banco de dados.
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // ALTERADO: Usando o cliente centralizado
        const { error } = await supabaseServerClient
            .from('orders')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.status(204).send(); // 204 No Content para sucesso na exclusão
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir pedido.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;