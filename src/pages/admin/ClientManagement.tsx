import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  ArrowLeft,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ClientManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    billingDay: "15",
    services: [] as string[]
  });

  // Mock clients data
  const clients = [
    {
      id: 1,
      name: "Maria Silva Santos",
      businessName: "Estética Bella Vita",
      email: "maria@bellavita.com",
      phone: "(11) 9 8765-4321",
      status: "Ativo",
      monthlyValue: 297.90,
      billingDay: 15,
      joinDate: "Jan 2024",
      services: ["Site", "Marketing", "Mini-site", "Consultoria"],
      lastLogin: "Hoje"
    },
    {
      id: 2,
      name: "João Carlos Mendes",
      businessName: "Auto Peças JR",
      email: "joao@autopecasjr.com",
      phone: "(11) 9 7654-3210",
      status: "Ativo",
      monthlyValue: 197.90,
      billingDay: 10,
      joinDate: "Dez 2023",
      services: ["Site", "Mini-site"],
      lastLogin: "2 dias atrás"
    },
    {
      id: 3,
      name: "Ana Oliveira Costa",
      businessName: "Advocacia & Consultoria",
      email: "ana@advocaciacosta.com",
      phone: "(11) 9 5432-1098",
      status: "Pendente",
      monthlyValue: 397.90,
      billingDay: 20,
      joinDate: "Jan 2024",
      services: ["Site", "Marketing", "Mini-site", "Consultoria", "App"],
      lastLogin: "Nunca"
    },
    {
      id: 4,
      name: "Carlos Roberto Silva",
      businessName: "Restaurante Sabor & Arte",
      email: "carlos@saborarte.com",
      phone: "(11) 9 4321-0987",
      status: "Ativo",
      monthlyValue: 247.90,
      billingDay: 5,
      joinDate: "Nov 2023",
      services: ["Site", "Marketing", "Mini-site"],
      lastLogin: "1 semana atrás"
    }
  ];

  const availableServices = [
    { id: "site", name: "Site Profissional", price: 97.90 },
    { id: "marketing", name: "Marketing Digital", price: 97.90 },
    { id: "minisite", name: "Mini-site Personalizado", price: 47.90 },
    { id: "consultoria", name: "Consultoria Digital", price: 97.90 },
    { id: "app", name: "Aplicativo Mobile", price: 197.90 }
  ];

  const handleServiceToggle = (serviceId: string) => {
    setNewClient(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const calculateTotal = () => {
    return newClient.services.reduce((total, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleCreateClient = () => {
    if (!newClient.name || !newClient.email || newClient.services.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e selecione pelo menos um serviço.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cliente cadastrado!",
      description: `${newClient.name} foi adicionado com sucesso.`,
    });

    // Reset form
    setNewClient({
      name: "",
      businessName: "",
      email: "",
      phone: "",
      address: "",
      billingDay: "15",
      services: []
    });
    setIsNewClientDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case "Pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case "Inativo":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin/dashboard"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <div className="w-px h-6 bg-border"></div>
              <h1 className="text-xl font-bold">Gestão de Clientes</h1>
            </div>
            
            <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do cliente e selecione os serviços contratados
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Nome do Responsável *</Label>
                      <Input
                        id="clientName"
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                        placeholder="Nome completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nome da Empresa</Label>
                      <Input
                        id="businessName"
                        value={newClient.businessName}
                        onChange={(e) => setNewClient({...newClient, businessName: e.target.value})}
                        placeholder="Razão social ou nome fantasia"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                        placeholder="email@cliente.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                        placeholder="(11) 9 9999-9999"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Textarea
                      id="address"
                      value={newClient.address}
                      onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                      placeholder="Endereço completo"
                      rows={2}
                    />
                  </div>

                  {/* Billing */}
                  <div className="space-y-2">
                    <Label htmlFor="billingDay">Dia de Cobrança</Label>
                    <Select value={newClient.billingDay} onValueChange={(value) => setNewClient({...newClient, billingDay: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 28}, (_, i) => i + 1).map(day => (
                          <SelectItem key={day} value={day.toString()}>
                            Dia {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <Label>Serviços Contratados *</Label>
                    <div className="space-y-3">
                      {availableServices.map(service => (
                        <div key={service.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                          <Checkbox
                            id={service.id}
                            checked={newClient.services.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={service.id} className="cursor-pointer">
                              {service.name}
                            </Label>
                          </div>
                          <span className="font-medium">
                            R$ {service.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {newClient.services.length > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">
                          Total Mensal: R$ {calculateTotal().toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cobrança no dia {newClient.billingDay} de cada mês
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsNewClientDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateClient} className="btn-hero">
                      Cadastrar Cliente
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="card-elevated mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, empresa ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="btn-outline-brand">
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Clientes ({filteredClients.length})
                </CardTitle>
                <CardDescription>
                  Gerencie todos os clientes da plataforma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div 
                  key={client.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">{client.businessName}</p>
                        </div>
                        {getStatusBadge(client.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-1" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          {client.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />
                          R$ {client.monthlyValue.toFixed(2)}/mês
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Dia {client.billingDay}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {client.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Cliente desde {client.joinDate} • Último acesso: {client.lastLogin}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? "Nenhum cliente encontrado com esse termo de busca." : "Nenhum cliente cadastrado ainda."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientManagement;