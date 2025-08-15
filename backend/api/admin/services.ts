import { Router, Request, Response } from 'express';
// ADICIONADO: Importa nosso cliente Supabase centralizado.
import { supabaseServer } from '../../lib/supabase-server.js';
// ADICIONADO: Importa o iconMap e adiciona a extensão .js.
import { iconNames } from '../../../src/lib/icon-map.js';

// REMOVIDO: A inicialização local do Supabase e a importação do createClient foram retiradas.

const servicesAdminRouter = Router();

servicesAdminRouter.get('/', async (req: Request, res: Response) => {
  try {
    // ALTERADO: Usando o cliente centralizado
    const { data, error } = await supabaseServer
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
    // ALTERADO: Usando o cliente centralizado
    const { data, error } = await supabaseServer
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
    // ALTERADO: Usando o cliente centralizado
    const { data, error } = await supabaseServer
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
    // ALTERADO: Usando o cliente centralizado
    const { error } = await supabaseServer
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