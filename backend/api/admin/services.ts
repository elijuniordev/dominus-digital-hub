// backend/api/admin/services.ts
import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rota GET para listar todos os serviços -> GET /api/admin/services
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price, type, is_active, category, description');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

// Rota POST para adicionar um novo serviço -> POST /api/admin/services
router.post('/', async (req: Request, res: Response) => {
  const { name, category, description, type, price, is_active } = req.body;

  try {
      const { data: newService, error } = await supabase
        .from('services')
        .insert({ name, category, description, type, price, is_active })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json(newService);
  } catch (error: unknown) {
      if (error instanceof Error) {
          res.status(500).json({ error: error.message });
      } else {
          res.status(500).json({ error: 'Unknown error' });
      }
  }
});

// Rota PUT para editar um serviço existente -> PUT /api/admin/services/:id
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, description, type, price, is_active } = req.body;

  try {
      const { data: updatedService, error } = await supabase
        .from('services')
        .update({ name, category, description, type, price, is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json(updatedService);
  } catch (error: unknown) {
      if (error instanceof Error) {
          res.status(500).json({ error: error.message });
      } else {
          res.status(500).json({ error: 'Unknown error' });
      }
  }
});

// Rota DELETE para remover um serviço -> DELETE /api/admin/services/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(204).send();
  } catch(error: unknown) {
      if (error instanceof Error) {
          res.status(500).json({ error: error.message });
      } else {
          res.status(500).json({ error: 'Unknown error' });
      }
  }
});

export default router;