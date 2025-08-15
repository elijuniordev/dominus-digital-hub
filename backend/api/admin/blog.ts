console.log('[DEBUG] Carregando: api/admin/blog.ts');

import { Router, Request, Response } from 'express';
// A única dependência local deve ser o nosso cliente Supabase centralizado.
import { supabaseServer } from '../../lib/supabase-server.js';

const router = Router();

// Tipagem para os dados de atualização
type BlogPostUpdatePayload = {
  title?: string;
  slug?: string;
  content?: string;
  category_id?: string;
  featured_image_url?: string;
  status?: 'draft' | 'published';
  publish_date?: string | null;
  meta_description?: string;
  keywords?: string;
  image_alt_text?: string;
};

// Rota GET para listar todos os posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseServer
      .from('blog_posts')
      .select(`
        id, title, slug, content, publish_date, featured_image_url, status,
        users!inner(email), blog_categories!inner(name)
      `)
      .order('publish_date', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar posts.';
    res.status(500).json({ error: errorMessage });
  }
});

// Rota GET para buscar um post pelo slug
router.get('/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const { data, error } = await supabaseServer
            .from('blog_posts')
            .select(`*, users!inner(email), blog_categories!inner(name)`)
            .eq('slug', slug)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Post não encontrado.' });
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar o post.';
        res.status(500).json({ error: errorMessage });
    }
});

// Rota POST para criar um novo post
router.post('/', async (req: Request, res: Response) => {
    const { 
      title, content, author_id, category_id, featured_image_url, status,
      meta_description, keywords, image_alt_text
    } = req.body;

    if (!title || !content || !author_id || !category_id) {
        return res.status(400).json({ error: 'Campos principais são obrigatórios.' });
    }
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
        const { data, error } = await supabaseServer.from('blog_posts').insert({
            title, slug, content, author_id, category_id, featured_image_url,
            status: status || 'draft',
            publish_date: status === 'published' ? new Date().toISOString() : null,
            meta_description, keywords, image_alt_text
        }).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao criar post.';
        res.status(500).json({ error: errorMessage });
    }
});

// Rota PUT para atualizar um post
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { 
      title, content, category_id, featured_image_url, status,
      meta_description, keywords, image_alt_text
    } = req.body;
    
    const updateData: BlogPostUpdatePayload = {};
    if (title) { updateData.title = title; updateData.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); }
    if (content !== undefined) updateData.content = content;
    if (category_id) updateData.category_id = category_id;
    if (featured_image_url !== undefined) updateData.featured_image_url = featured_image_url;
    if (status) { updateData.status = status; updateData.publish_date = status === 'published' ? new Date().toISOString() : null; }
    if (meta_description !== undefined) updateData.meta_description = meta_description;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (image_alt_text !== undefined) updateData.image_alt_text = image_alt_text;

    try {
        const { data, error } = await supabaseServer.from('blog_posts').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar post.';
        res.status(500).json({ error: errorMessage });
    }
});

// Rota DELETE para excluir um post
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { error } = await supabaseServer.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir post.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;