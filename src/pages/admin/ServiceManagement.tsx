import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCallback } from "react";

const ServiceManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewServiceDialogOpen, setIsNewServiceDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    description: "",
    type: "recurring",
    price: 0,
    is_active: true
  });
  const [editingService, setEditingService] = useState(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/services');
      const data = await response.json();
      if (response.ok) {
        setServices(data);
      } else {
        throw new Error(data.error || 'Erro ao carregar serviços');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSaveService = async () => {
    // Lógica para salvar um novo serviço ou editar um existente
    const method = editingService ? 'PUT' : 'POST';
    const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
    const serviceData = editingService || newService;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar serviço');
      }

      toast({
        title: "Sucesso!",
        description: `Serviço ${editingService ? 'editado' : 'cadastrado'} com sucesso.`,
      });

      setIsNewServiceDialogOpen(false);
      setEditingService(null);
      setNewService({
        name: "", category: "", description: "", type: "recurring", price: 0, is_active: true
      });
      fetchServices();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setNewService(service);
    setIsNewServiceDialogOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao remover serviço');
      }

      toast({
        title: "Serviço removido!",
        description: "O serviço foi excluído com sucesso.",
      });

      fetchServices();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <h1 className="text-xl font-bold">Gestão de Serviços</h1>
            </div>
            <Dialog open={isNewServiceDialogOpen} onOpenChange={setIsNewServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Serviço
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingService ? 'Editar' : 'Adicionar'} Serviço</DialogTitle>
                  <DialogDescription>
                    {editingService ? 'Altere os detalhes do serviço.' : 'Preencha os campos para adicionar um novo serviço.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Serviço</Label>
                    <Input id="name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input id="category" value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Cobrança</Label>
                      <Select value={newService.type} onValueChange={(value) => setNewService({ ...newService, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurring">Recorrente</SelectItem>
                          <SelectItem value="one_time">Pagamento Único</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço</Label>
                      <Input id="price" type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="is_active" checked={newService.is_active} onCheckedChange={(checked) => setNewService({ ...newService, is_active: checked })} />
                    <Label htmlFor="is_active">Ativo</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => { setIsNewServiceDialogOpen(false); setEditingService(null); }}>Cancelar</Button>
                  <Button onClick={handleSaveService} className="btn-hero">{editingService ? 'Salvar Alterações' : 'Adicionar Serviço'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando serviços...</p>
            </div>
          ) : (
            services.map((service) => (
              <Card key={service.id} className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <Badge className={service.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {service.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{service.description}</p>
                      <p className="text-xl font-bold text-primary">R$ {service.price.toFixed(2)}/{service.type === 'recurring' ? 'mês' : 'único'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(service)}><Edit className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteService(service.id)}><Trash className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {services.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum serviço cadastrado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;