import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  MessageSquare,
  Calendar,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Mock admin data
  const stats = {
    totalClients: 47,
    monthlyRevenue: 14062.30,
    activeServices: 142,
    blogViews: 8934,
    newClientsThisMonth: 8,
    revenueGrowth: 12.5
  };

  const recentClients = [
    { name: "Ana Costa", business: "Salão de Beleza", date: "Hoje", status: "Ativo" },
    { name: "Carlos Silva", business: "Oficina Mecânica", date: "Ontem", status: "Pendente" },
    { name: "Maria Santos", business: "Consultório Médico", date: "2 dias", status: "Ativo" },
    { name: "João Oliveira", business: "Restaurante", date: "3 dias", status: "Ativo" }
  ];

  const serviceStats = [
    { name: "Sites Profissionais", count: 35, percentage: 74 },
    { name: "Marketing Digital", count: 28, percentage: 60 },
    { name: "Mini-sites", count: 42, percentage: 89 },
    { name: "Consultoria", count: 18, percentage: 38 },
    { name: "Apps Mobile", count: 12, percentage: 26 }
  ];

  const pendingOrders = [
    { client: "Estética Bella", service: "Placa Digital", status: "Produção", date: "15 Jan" },
    { client: "Auto Peças JR", service: "Placa QR Code", status: "Design", date: "14 Jan" },
    { client: "Advocacia Silva", service: "Placa Personalizada", status: "Aprovação", date: "13 Jan" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-gradient-brand font-bold text-xl">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Dominus Digital</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link to="/admin/clientes">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Clientes
                </Button>
              </Link>
              <Link to="/admin/blog">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Blog
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Visão geral da performance da Dominus Digital
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalClients}</p>
                  <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    +{stats.newClientsThisMonth} este mês
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground">Receita Mensal</p>
                  <Badge className="mt-1 text-xs bg-green-100 text-green-800">
                    +{stats.revenueGrowth}% vs mês anterior
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeServices}</p>
                  <p className="text-sm text-muted-foreground">Serviços Ativos</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Todos os clientes
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.blogViews.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground">Views no Blog</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Este mês
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Clients */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Clientes Recentes</CardTitle>
                  <CardDescription>Últimos cadastros na plataforma</CardDescription>
                </div>
                <Link to="/admin/clientes">
                  <Button variant="outline" size="sm" className="btn-outline-brand">
                    Ver Todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <p className="text-sm text-muted-foreground">{client.business}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={client.status === "Ativo" ? "default" : "outline"}
                        className={client.status === "Ativo" ? "bg-green-100 text-green-800" : ""}
                      >
                        {client.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{client.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Distribuição de Serviços</CardTitle>
              <CardDescription>Serviços mais contratados pelos clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceStats.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{service.name}</span>
                      <span className="text-sm text-muted-foreground">{service.count} clientes</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Orders */}
        <Card className="card-elevated mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pedidos Físicos Pendentes</CardTitle>
                <CardDescription>Placas e materiais físicos em produção</CardDescription>
              </div>
              <Link to="/admin/placas">
                <Button variant="outline" className="btn-outline-brand">
                  Gerenciar Pedidos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">{order.client}</h4>
                    <p className="text-sm text-muted-foreground">{order.service}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline"
                      className={
                        order.status === "Produção" ? "text-blue-800 border-blue-200" :
                        order.status === "Design" ? "text-purple-800 border-purple-200" :
                        "text-orange-800 border-orange-200"
                      }
                    >
                      {order.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades administrativas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/admin/clientes">
                <Button variant="outline" className="btn-outline-brand w-full h-auto p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Novo Cliente</p>
                    <p className="text-xs text-muted-foreground">Cadastrar cliente</p>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/servicos">
                <Button variant="outline" className="btn-outline-brand w-full h-auto p-4">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Serviços</p>
                    <p className="text-xs text-muted-foreground">Gerenciar catálogo</p>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/blog">
                <Button variant="outline" className="btn-outline-brand w-full h-auto p-4">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Novo Post</p>
                    <p className="text-xs text-muted-foreground">Publicar no blog</p>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/placas">
                <Button variant="outline" className="btn-outline-brand w-full h-auto p-4">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Pedidos</p>
                    <p className="text-xs text-muted-foreground">Placas físicas</p>
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

export default AdminDashboard;