// backend/api/public/blog.ts

import { Router, Request, Response } from 'express';
import supabaseServerClient from '../../lib/supabase-server.js';

const router = Router();

/**
 * @route GET /api/public/blog
 * @description Lista apenas os posts com status 'published'.
 */
// CORREÇÃO: Altera a rota para aceitar a requisição com ou sem a barra final.
router.get(['/', ''], async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseServerClient
      .from('blog_posts')
      .select(`id, title, slug, content, publish_date, featured_image_url, users(email), blog_categories(name)`)
      .eq('status', 'published') // Filtra apenas posts publicados
      .order('publish_date', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar posts públicos.';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;