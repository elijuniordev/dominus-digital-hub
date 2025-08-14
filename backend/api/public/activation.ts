import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) { throw new Error('Variáveis de ambiente do Supabase não configuradas.'); }
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * @route POST /api/public/activate
 * @description Ativa a conta de um cliente usando a chave de ativação.
 */
router.post('/activate', async (req: Request, res: Response) => {
    const { activation_key, password } = req.body;

    if (!activation_key || !password) {
        return res.status(400).json({ error: 'Chave de ativação e senha são obrigatórias.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    try {
        // 1. Encontrar o cliente pela chave de ativação
        const { data: clientInfo, error: findError } = await supabase
            .from('clients_info')
            .select('user_id, activation_key')
            .eq('activation_key', activation_key)
            .single();

        if (findError || !clientInfo || !clientInfo.user_id) {
            return res.status(404).json({ error: 'Chave de ativação inválida ou já utilizada.' });
        }
        
        const { user_id } = clientInfo;

        // 2. Atualizar o usuário no Supabase Auth com a nova senha
        const { error: updateUserError } = await supabase.auth.admin.updateUserById(
            user_id,
            { password: password }
        );

        if (updateUserError) {
            throw new Error(updateUserError.message);
        }
        
        // 3. (Opcional, mas recomendado) Nulificar a chave de ativação para que não possa ser usada novamente
        await supabase
            .from('clients_info')
            .update({ activation_key: null })
            .eq('user_id', user_id);

        res.status(200).json({ message: 'Conta ativada com sucesso!' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro interno ao ativar a conta.';
        console.error('Erro na ativação:', error);
        res.status(500).json({ error: errorMessage });
    }
});

export default router;