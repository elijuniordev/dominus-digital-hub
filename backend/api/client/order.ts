import { Router, Request, Response } from 'express';
import supabaseServerClient from '../../lib/supabase-server'; // Importa nosso cliente Supabase

const router = Router();

/**
 * @route GET /api/client/orders
 * @description Lista todos os pedidos associados ao cliente autenticado.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // O middleware de autenticação já validou o token e adicionou 'user' ao 'req'.
    // A propriedade 'user' deve conter o ID do usuário logado.
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Busca os contratos (pedidos) que pertencem ao ID do cliente associado a este usuário.
    // Esta query assume que a tabela 'contracts' tem uma coluna 'client_id'
    // e que a tabela 'clients_info' tem uma coluna 'user_id' para fazer a ligação.
    const { data: clientInfo, error: clientError } = await supabaseServerClient
      .from('clients_info')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (clientError || !clientInfo) {
      return res.status(404).json({ error: 'Informações do cliente não encontradas.' });
    }

    const { data: orders, error: ordersError } = await supabaseServerClient
      .from('contracts') // Ou a sua tabela de pedidos/contratos
      .select('*') // Selecione os campos que o cliente precisa ver
      .eq('client_id', clientInfo.id); // O filtro MÁGICO que garante a segurança!

    if (ordersError) {
      throw ordersError;
    }

    res.status(200).json(orders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar pedidos.';
    console.error('[API CLIENT ORDERS GET] Erro:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;