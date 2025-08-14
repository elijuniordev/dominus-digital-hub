import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCards } from "@/components/pages/admin-dashboard/KpiCards";
import { OrdersStatus } from "@/components/pages/admin-dashboard/OrdersStatus";
import { OverviewChart } from "@/components/pages/admin-dashboard/OverviewChart";

// Tipagem para os dados JÁ FORMATADOS para os componentes
type DashboardData = {
  kpis: { mrr: number; activeClients: number; totalOrders: number; };
  ordersByStatus: { [status: string]: number; };
  charts: { revenueByMonth: { name: string; total: number; }[] };
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) throw new Error((await response.json()).error || "Falha ao buscar dados.");
      
      const data: DashboardData = await response.json();
      setDashboardData(data);

    } catch (error) {
      toast({ title: "Erro", description: error instanceof Error ? error.message : "Erro desconhecido.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Tela de carregamento (Skeleton)
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between"><Skeleton className="h-9 w-64" /></div>
        <div className="grid gap-6 md:grid-cols-3"><Skeleton className="h-[108px] rounded-xl" /><Skeleton className="h-[108px] rounded-xl" /><Skeleton className="h-[108px] rounded-xl" /></div>
        <div className="grid gap-6 lg:grid-cols-7"><Skeleton className="h-[418px] col-span-4" /><Skeleton className="h-[418px] col-span-3" /></div>
      </div>
    );
  }

  // Tela de erro se os dados não puderem ser carregados
  if (!dashboardData) {
    return <div className="text-center text-muted-foreground">Não foi possível carregar os dados do dashboard. Tente recarregar a página.</div>;
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Passando os dados reais para os componentes filhos */}
      <KpiCards kpis={dashboardData.kpis} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OverviewChart data={dashboardData.charts.revenueByMonth} />
        <OrdersStatus ordersByStatus={dashboardData.ordersByStatus} />
      </div>
    </div>
  );
};

export default AdminDashboard;