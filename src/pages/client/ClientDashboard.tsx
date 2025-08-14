import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Zap, Package, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 

// --- TIPAGEM ---
// Define a estrutura exata dos dados que esperamos da API do dashboard do cliente

type ClientInfo = {
  full_name: string;
  business_name: string | null;
  created_at: string;
};

type Service = {
  name: string;
  description: string;
  type: 'recurring' | 'one_time';
  category: string;
};

type Contract = {
  id: number;
  status: 'active' | 'inactive' | 'pending_payment' | 'canceled';
  services: Service;
};

type ActiveOrder = {
  id: number;
  order_status: string;
  services: { name: string };
};

type DashboardData = {
  clientInfo: ClientInfo;
  contracts: Contract[];
  activeOrders: ActiveOrder[];
};

// Mapeia os status dos contratos para texto e cor
const contractStatusMap: Record<Contract['status'], { text: string; variant: "default" | "destructive" | "outline" }> = {
    active: { text: "Ativo", variant: "default" },
    inactive: { text: "Inativo", variant: "destructive" },
    pending_payment: { text: "Pagamento Pendente", variant: "destructive" },
    canceled: { text: "Cancelado", variant: "destructive" },
};


// --- COMPONENTE ---

const ClientDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    // Recupera o token de autenticação (assumindo que foi salvo no localStorage após o login)
    const token = localStorage.getItem('supabase-token');

    if (!token) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado para ver esta página.", variant: "destructive" });
      navigate('/portal/login');
      return;
    }

    try {
      const response = await fetch('/api/client/dashboard-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
         localStorage.removeItem('supabase-token'); // Limpa o token inválido
         toast({ title: "Sessão Expirada", description: "Por favor, faça o login novamente.", variant: "destructive" });
         navigate('/portal/login');
         return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar dados do dashboard");
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (error) {
      const description = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast({
        title: "Erro ao carregar dashboard",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Componente de Skeleton para a tela de carregamento
  const DashboardSkeleton = () => (
     <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5 mt-2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5 mt-2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5 mt-2" /></CardContent></Card>
        </div>
     </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40 p-4 md:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!dashboardData) {
     return (
        <div className="min-h-screen bg-muted/40 p-4 md:p-8 flex items-center justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader><CardTitle>Erro</CardTitle></CardHeader>
                <CardContent>
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4"/>
                    <p>Não foi possível carregar os dados do seu dashboard.</p>
                    <Button onClick={fetchData} className="mt-4">Tentar Novamente</Button>
                </CardContent>
            </Card>
        </div>
     )
  }

  return (
    // Aqui você pode futuramente envolver com um <ClientLayout>
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bem-vindo, {dashboardData.clientInfo.full_name}!</h1>
        <p className="text-muted-foreground">Aqui está um resumo dos seus serviços e projetos.</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Seus Serviços Contratados</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboardData.contracts.map(contract => (
              <Card key={contract.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{contract.services.name}</CardTitle>
                    <Badge variant={contractStatusMap[contract.status].variant}>
                      {contractStatusMap[contract.status].text}
                    </Badge>
                  </div>
                  <CardDescription>{contract.services.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{contract.services.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Projetos em Andamento</h2>
          {dashboardData.activeOrders.length > 0 ? (
             <Card>
                <CardContent className="p-0">
                   {dashboardData.activeOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                         <div>
                            <p className="font-medium">{order.services.name}</p>
                            <p className="text-sm text-muted-foreground">Status atual</p>
                         </div>
                         <Badge variant="outline">{order.order_status.replace(/_/g, ' ')}</Badge>
                      </div>
                   ))}
                </CardContent>
             </Card>
          ) : (
             <Card className="text-center py-8">
                <CardContent>
                   <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4"/>
                   <p className="font-medium">Tudo certo por aqui!</p>
                   <p className="text-muted-foreground">Você não possui nenhum projeto em andamento no momento.</p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;