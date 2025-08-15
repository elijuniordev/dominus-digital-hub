// backend/api/public/services.ts

import { Router, Request, Response } from 'express';
import { supabaseServer } from '../../lib/supabase-server.js';
import { iconNames } from '../../../src/lib/icon-map.js';

const router = Router();

// CORREÇÃO: Altera a rota para aceitar a requisição com ou sem a barra final.
router.get(['/', ''], async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseServer
            .from('services')
            .select('*')
            .order('name', { ascending: true });
        if (error) {
            console.error('[API_PUBLIC_SERVICES] Erro do Supabase:', error);
            throw error;
        }
        res.status(200).json(data);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar serviços.';
        console.error('[API_PUBLIC_SERVICES] Catch Error:', err);
        res.status(500).json({ error: errorMessage });
    }
});

export default router;