// backend/api/admin/blog_helpers.ts
import { Router, Request, Response } from 'express';
// ADICIONADO: Importa nosso cliente Supabase centralizado e seguro.
import supabaseServerClient from '../../lib/supabase-server.js';

// REMOVIDO: A importação do createClient e a inicialização local foram retiradas.

const router = Router();

// Rota para buscar todos os usuários (para serem autores)
router.get('/users', async (req: Request, res: Response) => {
    try {
        // ALTERADO: Usando o cliente centralizado
        const { data, error } = await supabaseServerClient
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
        // ALTERADO: Usando o cliente centralizado
        const { data, error } = await supabaseServerClient
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