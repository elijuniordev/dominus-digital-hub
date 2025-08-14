import { createClient } from '@supabase/supabase-js';
import { Router, Request, Response } from 'express';

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) { throw new Error('Variáveis de ambiente do Supabase não configuradas.'); }
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Interfaces para garantir a tipagem
interface MrrContract {
  services: { price: number; type: 'recurring' | 'one_time'; }[] | null;
}

// CORREÇÃO: Interface específica para os dados da receita mensal
interface MonthlyRevenueContract {
    created_at: string;
    services: { price: number }[] | null;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    // KPIs (Clientes, MRR, Pedidos)
    const { count: activeClients } = await supabase.from('contracts').select('client_id', { count: 'exact', head: true }).eq('status', 'active');
    const { data: mrrData } = await supabase.from('contracts').select('services ( price, type )').eq('status', 'active');
    const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const { data: ordersStatusData } = await supabase.from('orders').select('order_status');
    
    const typedMrrData = mrrData as MrrContract[] | null;
    const mrr = typedMrrData?.filter(c => c.services && c.services.length > 0 && c.services[0].type === 'recurring').reduce((total, c) => total + (c.services?.[0]?.price || 0), 0) || 0;
    const ordersByStatus = ordersStatusData?.reduce((acc, order) => { const status = order.order_status || 'desconhecido'; acc[status] = (acc[status] || 0) + 1; return acc; }, {} as Record<string, number>) || {};

    // DADOS PARA O GRÁFICO (Receita dos Últimos 6 Meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: monthlyRevenue, error: revenueError } = await supabase
      .from('contracts')
      .select('created_at, services ( price )')
      .eq('status', 'active')
      .gte('created_at', sixMonthsAgo.toISOString());

    if (revenueError) throw new Error(`Erro ao buscar receita mensal: ${revenueError.message}`);

    // CORREÇÃO: Usando a interface para uma conversão de tipo segura, sem 'any'
    const typedMonthlyRevenue = monthlyRevenue as MonthlyRevenueContract[];
    const revenueByMonth = typedMonthlyRevenue.reduce((acc, contract) => {
        const month = new Date(contract.created_at).toLocaleString('pt-BR', { month: 'short' });
        const price = contract.services?.[0]?.price || 0;
        acc[month] = (acc[month] || 0) + price;
        return acc;
    }, {} as Record<string, number>);
    
    const chartData = Object.entries(revenueByMonth).map(([name, total]) => ({ name, total }));

    // Montar o objeto de resposta final
    const dashboardData = {
      kpis: { 
        activeClients: activeClients || 0, 
        mrr, 
        totalOrders: totalOrders || 0
      },
      ordersByStatus,
      charts: { revenueByMonth: chartData }
    };
    res.status(200).json(dashboardData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
    console.error('Erro na rota GET /api/admin/dashboard:', error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;