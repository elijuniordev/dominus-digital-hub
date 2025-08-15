import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { iconNames } from '../../../src/lib/icon-map'; // CORRIGIDO: O caminho relativo está certo agora

const servicesAdminRouter = Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('As variáveis de ambiente do Supabase não estão configuradas no backend.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

servicesAdminRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar serviços:', error);
      return res.status(500).json({ error: 'Erro ao buscar serviços do banco de dados.' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro inesperado na rota de serviços:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

servicesAdminRouter.get('/icons', (req: Request, res: Response) => {
  res.status(200).json(iconNames);
});

servicesAdminRouter.post('/', async (req: Request, res: Response) => {
  const newService = req.body;

  if (newService.icon && !iconNames.includes(newService.icon)) {
    return res.status(400).json({ error: 'Ícone inválido.' });
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .insert(newService)
      .select();

    if (error) {
      console.error('Erro ao criar serviço:', error);
      return res.status(500).json({ error: 'Erro ao criar serviço no banco de dados.' });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('Erro inesperado ao criar serviço:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

servicesAdminRouter.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedService = req.body;

  if (updatedService.icon && !iconNames.includes(updatedService.icon)) {
    return res.status(400).json({ error: 'Ícone inválido.' });
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .update(updatedService)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar serviço:', error);
      return res.status(500).json({ error: 'Erro ao atualizar serviço no banco de dados.' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro inesperado ao atualizar serviço:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

servicesAdminRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar serviço:', error);
      return res.status(500).json({ error: 'Erro ao deletar serviço do banco de dados.' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Erro inesperado ao deletar serviço:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

export default servicesAdminRouter;