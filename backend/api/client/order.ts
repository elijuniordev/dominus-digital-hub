import { Router, Request, Response } from 'express';
import supabaseServerClient from '../../lib/supabase-server.js'; // Corrigido com .js

const router = Router();

// Esta rota agora usa o 'req.user' que o middleware de autenticação fornece
router.get('/', async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }
    
    const { data: clientInfo, error: clientError } = await supabaseServerClient
      .from('clients_info')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (clientError || !clientInfo) {
      return res.status(404).json({ error: 'Informações do cliente não encontradas.' });
    }

    const { data: orders, error: ordersError } = await supabaseServerClient
      .from('contracts') // Assumindo que 'contracts' é a tabela de pedidos
      .select('*')
      .eq('client_id', clientInfo.id);

    if (ordersError) {
      throw ordersError;
    }

    res.status(200).json(orders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar pedidos.';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;