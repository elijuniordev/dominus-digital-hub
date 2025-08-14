import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';

const router = Router();

// Inicialização segura do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('As variáveis de ambiente do Supabase não estão configuradas no backend.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);


/**
 * @route GET /api/admin/physical-orders
 * @description Lista todos os pedidos físicos, incluindo o nome do cliente.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('physical_orders')
      .select(`
        id,
        order_date,
        order_status,
        tracking_code,
        client_id,
        clients_info ( full_name, business_name )
      `)
      .order('order_date', { ascending: false }); // Ordena pelos mais recentes

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar pedidos.';
    res.status(500).json({ error: errorMessage });
  }
});


/**
 * @route POST /api/admin/physical-orders
 * @description Cria um novo pedido físico para um cliente.
 */
router.post('/', async (req: Request, res: Response) => {
    const { client_id, service_id } = req.body;

    if (!client_id || !service_id) {
        return res.status(400).json({ error: 'ID do cliente e ID do serviço são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('physical_orders')
            .insert({
                client_id: client_id,
                service_id: service_id,
                order_status: 'in_production', // Status inicial padrão
                order_date: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar pedido.';
        res.status(500).json({ error: errorMessage });
    }
});


/**
 * @route PUT /api/admin/physical-orders/:id
 * @description Atualiza o status e/ou o código de rastreio de um pedido.
 */
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { order_status, tracking_code } = req.body;

    if (!order_status && !tracking_code) {
        return res.status(400).json({ error: 'É necessário fornecer um status ou código de rastreio.' });
    }
    
    // Objeto para conter apenas os campos que serão atualizados
    const updateData: { order_status?: string, tracking_code?: string } = {};
    if (order_status) updateData.order_status = order_status;
    if (tracking_code !== undefined) updateData.tracking_code = tracking_code;

    try {
        const { data, error } = await supabase
            .from('physical_orders')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar pedido.';
        res.status(500).json({ error: errorMessage });
    }
});


/**
 * @route DELETE /api/admin/physical-orders/:id
 * @description Exclui um pedido físico.
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('physical_orders')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        res.status(204).send(); // Sucesso, sem conteúdo
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao excluir pedido.';
        res.status(500).json({ error: errorMessage });
    }
});


export default router;