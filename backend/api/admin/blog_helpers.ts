// backend/api/admin/blog_helpers.ts
import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('As variáveis de ambiente do Supabase não estão configuradas no backend.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rota para buscar todos os usuários (para serem autores)
router.get('/users', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, role'); // Selecionamos os campos necessários
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar usuários.';
        res.status(500).json({ error: errorMessage });
    }
});

// Rota para buscar todas as categorias de blog
router.get('/blog-categories', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('blog_categories')
            .select('id, name');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar categorias.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;