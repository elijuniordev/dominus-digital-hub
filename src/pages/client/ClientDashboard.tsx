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
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";

const ClientDashboard = () => {
  // Mock client data
  const clientData = {
    name: "Maria Silva",
    businessName: "Estética Bella Vita",
    memberSince: "Janeiro 2024",
    nextBilling: "15 Fev 2024"
  };

  const services = [
    {
      id: 1,
      name: "Site Profissional",
      description: "Website responsivo com design moderno",
      status: "Ativo",
      progress: 100,
      icon: Globe,
      color: "bg-green-500",
      lastUpdate: "Há 2 dias",
      actions: ["Visualizar", "Editar"]
    },
    {
      id: 2,
      name: "Marketing Digital",
      description: "Gestão de redes sociais e campanhas",
      status: "Em Andamento",
      progress: 75,
      icon: Instagram,
      color: "bg-blue-500",
      lastUpdate: "Hoje",
      actions: ["Ver Relatório"]
    },
    {
      id: 3,
      name: "Mini-site Personalizado",
      description: "Página digital para compartilhamento",
      status: "Ativo",
      progress: 100,
      icon: Users,
      color: "bg-purple-500",
      lastUpdate: "Há 1 hora",
      actions: ["Visualizar", "Personalizar"]
    },
    {
      id: 4,
      name: "Consultoria Digital",
      description: "Análise e estratégias personalizadas",
      status: "Agendado",
      progress: 25,
      icon: BarChart3,
      color: "bg-orange-500",
      lastUpdate: "Há 1 semana",
      actions: ["Agendar Reunião"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case "Em Andamento":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>;
      case "Agendado":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Agendado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
              <Button variant="outline" size="sm">
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
            Olá, {clientData.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Bem-vinda de volta ao painel do <strong>{clientData.businessName}</strong>. 
            Cliente desde {clientData.memberSince}.
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
                  <p className="text-2xl font-bold">4</p>
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
                  <p className="text-2xl font-bold">{clientData.nextBilling}</p>
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
                      <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
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
                      <span>{service.progress}%</span>
                    </div>
                    <Progress value={service.progress} className="h-2" />
                  </div>

                  {/* Last Update */}
                  <p className="text-sm text-muted-foreground">
                    Última atualização: {service.lastUpdate}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {service.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={index === 0 ? "default" : "outline"}
                        className={index === 0 ? "btn-hero" : "btn-outline-brand"}
                      >
                        {action === "Visualizar" && <Eye className="w-4 h-4 mr-1" />}
                        {action === "Personalizar" && <Edit className="w-4 h-4 mr-1" />}
                        {action === "Editar" && <Edit className="w-4 h-4 mr-1" />}
                        {action === "Ver Relatório" && <BarChart3 className="w-4 h-4 mr-1" />}
                        {action === "Agendar Reunião" && <Users className="w-4 h-4 mr-1" />}
                        <span className="text-xs">{action}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades do seu portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/cliente/maria-silva" target="_blank">
                <Button variant="outline" className="btn-outline-brand w-full h-auto p-4">
                  <div className="text-center">
                    <ExternalLink className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Ver Mini-site</p>
                    <p className="text-xs text-muted-foreground">Visualizar como visitante</p>
                  </div>
                </Button>
              </Link>

              <Link to="/portal/personalizar">
                <Button variant="outline" className="btn-outline-brand w-full h-auto p-4">
                  <div className="text-center">
                    <Settings className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Personalizar</p>
                    <p className="text-xs text-muted-foreground">Editar informações</p>
                  </div>
                </Button>
              </Link>

              <Link to="/portal/cobranca">
                <Button variant="outline" className="btn-outline-brand w-full h-auto p-4">
                  <div className="text-center">
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Cobrança</p>
                    <p className="text-xs text-muted-foreground">Ver faturas</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;