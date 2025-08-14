import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) { throw new Error('Variáveis de ambiente do Supabase não configuradas.'); }
const supabase = createClient(supabaseUrl, supabaseServiceKey);

type BlogPostUpdatePayload = {
  title?: string;
  slug?: string;
  content?: string;
  category_id?: string; // Corrigido para string para corresponder ao UUID
  featured_image_url?: string;
  status?: 'draft' | 'published';
  publish_date?: string | null;
};

/**
 * @route GET /api/admin/blog
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // CORREÇÃO: Removido o comentário de dentro da string
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        content,
        publish_date,
        featured_image_url,
        status,
        users!inner(email),
        blog_categories!inner(name)
      `)
      .order('publish_date', { ascending: false });

    if (error) {
        console.error('Erro detalhado do Supabase ao buscar posts:', error);
        throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar posts.';
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route GET /api/admin/blog/:slug
 */
router.get('/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select(`
                title,
                content,
                publish_date,
                featured_image_url,
                users!inner ( email ),
                blog_categories!inner ( name )
            `)
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Post não encontrado.' });
        }
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar o post.';
        res.status(500).json({ error: errorMessage });
    }
});

/**
 * @route POST /api/admin/blog
 */
router.post('/', async (req: Request, res: Response) => {
    const { title, content, author_id, category_id, featured_image_url, status } = req.body;
    if (!title || !content || !author_id || !category_id) {
        return res.status(400).json({ error: 'Título, conteúdo, autor e categoria são obrigatórios.' });
    }
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
        const { data, error } = await supabase.from('blog_posts').insert({
            title, slug, content, author_id, category_id, featured_image_url,
            status: status || 'draft',
            publish_date: status === 'published' ? new Date().toISOString() : null,
        }).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao criar post.';
        res.status(500).json({ error: errorMessage });
    }
});

/**
 * @route PUT /api/admin/blog/:id
 */
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, category_id, featured_image_url, status } = req.body;
    const updateData: BlogPostUpdatePayload = {};
    if (title) {
        updateData.title = title;
        updateData.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    if (content) updateData.content = content;
    if (category_id) updateData.category_id = category_id;
    if (featured_image_url) updateData.featured_image_url = featured_image_url;
    if (status) {
        updateData.status = status;
        if (status === 'published') {
            updateData.publish_date = new Date().toISOString();
        }
    }
    try {
        const { data, error } = await supabase.from('blog_posts').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar post.';
        res.status(500).json({ error: errorMessage });
    }
});

/**
 * @route DELETE /api/admin/blog/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir post.';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;