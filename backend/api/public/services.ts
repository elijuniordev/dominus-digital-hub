import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { iconNames } from '../../../src/lib/icon-map'; // CORRIGIDO: O caminho relativo está certo agora

const servicesRouter = Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('As variáveis de ambiente do Supabase não estão configuradas no backend.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rota para buscar todos os serviços
servicesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*');

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

// NOVO: Rota para buscar um serviço por slug
servicesRouter.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Erro ao buscar serviço:', error);
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Erro inesperado na rota de serviço:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

export default servicesRouter;