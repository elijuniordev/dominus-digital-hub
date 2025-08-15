import { Router, Request, Response } from 'express';
import supabaseServerClient from '../../lib/supabase-server.js';
// CORRIGIDO: Adicionada a extensão .js no final do import
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = req.user;
    if (!user || !user.id) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }
    try {
        const { data: clientInfo, error: clientInfoError } = await supabaseServerClient
            .from('clients_info')
            .select('id, full_name, business_name, mini_site_url')
            .eq('user_id', user.id)
            .single();

        if (clientInfoError || !clientInfo) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        const { data: contracts, error: contractsError } = await supabaseServerClient
            .from('contracts')
            .select('status, services(name, description, price)')
            .eq('client_id', clientInfo.id);

        if (contractsError) {
            throw contractsError;
        }

        const dashboardData = {
            client: clientInfo,
            contracts: contracts || [],
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dados do dashboard.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;