// backend/api/admin/services.ts
import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rota GET para listar todos os serviços
router.get('/services', async (req: Request, res: Response) => {
  const { data: services, error } = await supabase
    .from('services')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(services);
});

// Rota POST para adicionar um novo serviço
router.post('/services', async (req: Request, res: Response) => {
  const { name, category, description, type, price, is_active } = req.body;

  const { data: newService, error } = await supabase
    .from('services')
    .insert({ name, category, description, type, price, is_active })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(newService);
});

// Rota PUT para editar um serviço existente
router.put('/services/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, description, type, price, is_active } = req.body;

  const { data: updatedService, error } = await supabase
    .from('services')
    .update({ name, category, description, type, price, is_active })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(updatedService);
});

// Rota DELETE para remover um serviço
router.delete('/services/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
});

export default router;