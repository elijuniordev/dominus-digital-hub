import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth'; // O caminho de importação está correto

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) { throw new Error('Variáveis de ambiente do Supabase não configuradas.'); }
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/dashboard-data', authenticateToken, async (req: Request, res: Response) => {
    // Agora o TypeScript sabe que req.user existe e tem um 'id'
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'ID do usuário não encontrado no token.' });
    }

    try {
        const { data: clientInfo, error: clientError } = await supabase
            .from('clients_info')
            .select('id, full_name, business_name, created_at')
            .eq('user_id', userId)
            .single();

        if (clientError || !clientInfo) {
            return res.status(404).json({ error: 'Dados do cliente não encontrados.' });
        }
        const clientId = clientInfo.id;

        const { data: contracts, error: contractsError } = await supabase
            .from('contracts')
            .select(`id, status, services ( name, description, type, category )`)
            .eq('client_id', clientId);
        if (contractsError) throw contractsError;

        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select(`id, order_status, services ( name )`)
            .eq('client_id', clientId)
            .in('order_status', ['pending', 'in_production', 'approval_pending', 'approved', 'in_transit']);
        if (ordersError) throw ordersError;
        
        res.status(200).json({ clientInfo, contracts, activeOrders: orders });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dados do dashboard.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;