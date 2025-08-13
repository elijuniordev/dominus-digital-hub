import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Instagram, 
  Users, 
  BarChart3, 
  Settings, 
  CreditCard,
  ExternalLink,
  Eye,
  Edit,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ClientDashboard = () => {
  const [clientData, setClientData] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // 1. Obter a sessão do usuário autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          navigate("/portal/login");
          return;
        }

        // 2. Buscar o client_info e o nome do negócio
        const { data: clientInfo, error: clientInfoError } = await supabase
          .from('clients_info')
          .select('id, full_name, business_name, created_at')
          .eq('user_id', user.id)
          .single();

        if (clientInfoError || !clientInfo) {
          throw new Error("Dados do cliente não encontrados.");
        }

        // 3. Buscar os serviços e contratos do cliente
        const { data: contractsData, error: contractsError } = await supabase
          .from('contracts')
          .select(`
            id,
            status,
            contract_date,
            next_billing_date,
            services (
              name, 
              description,
              type
            )
          `)
          .eq('client_id', clientInfo.id);

        if (contractsError) {
          throw new Error("Erro ao buscar contratos.");
        }
        
        setClientData({ ...clientInfo, name: clientInfo.full_name, memberSince: new Date(clientInfo.created_at).toLocaleDateString('pt-BR') });
        setServices(contractsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case "suspended":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const totalActiveServices = services.filter(s => s.status === 'active').length;
  const nextBillingDate = services.find(s => s.next_billing_date)?.next_billing_date || "N/A";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Carregando...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <Card>
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-gradient-brand font-bold text-xl">Portal do Cliente</h1>
                <p className="text-sm text-muted-foreground">Dominus Digital</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link to="/portal/personalizar">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Personalizar
                </Button>
              </Link>
              <Link to="/portal/cobranca">
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cobrança
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Olá, {clientData?.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Bem-vinda de volta ao painel do <strong>{clientData?.businessName}</strong>. 
            Cliente desde {clientData?.memberSince}.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalActiveServices}</p>
                  <p className="text-sm text-muted-foreground">Serviços Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-muted-foreground">Progresso Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1.2k</p>
                  <p className="text-sm text-muted-foreground">Visitantes/mês</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{nextBillingDate}</p>
                  <p className="text-sm text-muted-foreground">Próxima Cobrança</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Seus Serviços</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="card-elevated hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500`}>
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.services.name}</CardTitle>
                        <CardDescription>{service.services.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  {/* Last Update */}
                  <p className="text-sm text-muted-foreground">
                    Última atualização: Hoje
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                        size="sm"
                        variant="default"
                        className="btn-hero"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-xs">Visualizar</span>
                    </Button>
                    {service.services.name === 'Mini-site Personalizado' && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="btn-outline-brand"
                            asChild
                        >
                          <Link to="/portal/personalizar">
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="text-xs">Personalizar</span>
                          </Link>
                        </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;