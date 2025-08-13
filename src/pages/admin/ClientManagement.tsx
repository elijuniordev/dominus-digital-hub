import { useState, useEffect } from "react";
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
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

const ClientManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [clients, setClients] = useState([]); // Array vazio para dados da API
  const [availableServices, setAvailableServices] = useState([]); // Array vazio para dados da API
  const [isLoading, setIsLoading] = useState(true);
  const [newClient, setNewClient] = useState({
    full_name: "", // Nome do campo conforme a API
    business_name: "",
    email: "",
    phone: "",
    address: "",
    billing_day: "15",
    services: [] as string[]
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case "suspended":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClientServices = (contracts) => {
    return contracts.map(contract => contract.services.name);
  };

  const calculateTotal = () => {
    return newClient.services.reduce((total, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleServiceToggle = (serviceId) => {
    setNewClient(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsRes = await fetch('/api/admin/clients');
      const servicesRes = await fetch('/api/services'); // Esta rota precisa ser criada
      
      const clientsData = await clientsRes.json();
      const servicesData = await servicesRes.json();
      
      setClients(clientsData.map(client => ({
        ...client,
        services: getClientServices(client.contracts),
        monthly_total: client.contracts.reduce((acc, curr) => acc + curr.monthly_total, 0),
        status: client.contracts.find(c => c.services.name === "Mini-site com Manutenção Proativa")?.status || 'inactive'
      })));

      setAvailableServices(servicesData);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleCreateClient = async () => {
    if (!newClient.full_name || !newClient.email || newClient.services.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e selecione pelo menos um serviço.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro desconhecido ao cadastrar cliente.');
      }

      toast({
        title: "Cliente cadastrado!",
        description: `${newClient.full_name} foi adicionado com sucesso.`,
      });

      setNewClient({
        full_name: "", business_name: "", email: "", phone: "", address: "", billing_day: "15", services: []
      });
      setIsNewClientDialogOpen(false);
      fetchClients(); // Refresh client list
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        value={newClient.full_name}
                        onChange={(e) => setNewClient({...newClient, full_name: e.target.value})}
                        placeholder="Nome completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nome da Empresa</Label>
                      <Input
                        id="businessName"
                        value={newClient.business_name}
                        onChange={(e) => setNewClient({...newClient, business_name: e.target.value})}
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
                    <Select value={newClient.billing_day} onValueChange={(value) => setNewClient({...newClient, billing_day: value})}>
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
                          Cobrança no dia {newClient.billing_day} de cada mês
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
                    <Button onClick={handleCreateClient} className="btn-hero" disabled={isLoading}>
                      {isLoading ? "Cadastrando..." : "Cadastrar Cliente"}
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
                            {client.full_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{client.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{client.business_name}</p>
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
                          {client.phone || "N/A"}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />
                          R$ {client.monthly_total?.toFixed(2) || "0.00"}/mês
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Dia {client.contracts?.[0]?.billing_day || "N/A"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {client.services?.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {/* Dados de data de cadastro ou último acesso */}
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

            {isLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Carregando clientes...
                </p>
              </div>
            )}
            
            {!isLoading && filteredClients.length === 0 && (
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