import { Router, Request, Response } from 'express';
// ADICIONADO: Importa nosso cliente Supabase centralizado.
import supabaseServerClient from '../../lib/supabase-server.js';

// REMOVIDO: A inicialização local do Supabase foi retirada daqui.

const router = Router();

// Interfaces para garantir a tipagem
interface MrrContract {
  services: { price: number; type: 'recurring' | 'one_time'; }[] | null;
}

// Interface específica para os dados da receita mensal
interface MonthlyRevenueContract {
    created_at: string;
    services: { price: number }[] | null;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    // KPIs (Clientes, MRR, Pedidos)
    // ALTERADO: Usando o cliente centralizado
    const { count: activeClients } = await supabaseServerClient.from('contracts').select('client_id', { count: 'exact', head: true }).eq('status', 'active');
    const { data: mrrData } = await supabaseServerClient.from('contracts').select('services ( price, type )').eq('status', 'active');
    const { count: totalOrders } = await supabaseServerClient.from('orders').select('*', { count: 'exact', head: true });
    const { data: ordersStatusData } = await supabaseServerClient.from('orders').select('order_status');
    
    const typedMrrData = mrrData as MrrContract[] | null;
    const mrr = typedMrrData?.filter(c => c.services && c.services.length > 0 && c.services[0].type === 'recurring').reduce((total, c) => total + (c.services?.[0]?.price || 0), 0) || 0;
    const ordersByStatus = ordersStatusData?.reduce((acc, order) => { const status = order.order_status || 'desconhecido'; acc[status] = (acc[status] || 0) + 1; return acc; }, {} as Record<string, number>) || {};

    // DADOS PARA O GRÁFICO (Receita dos Últimos 6 Meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // ALTERADO: Usando o cliente centralizado
    const { data: monthlyRevenue, error: revenueError } = await supabaseServerClient
      .from('contracts')
      .select('created_at, services ( price )')
      .eq('status', 'active')
      .gte('created_at', sixMonthsAgo.toISOString());

    if (revenueError) throw new Error(`Erro ao buscar receita mensal: ${revenueError.message}`);

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