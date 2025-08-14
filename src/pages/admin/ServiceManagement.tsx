import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Definindo o tipo de Serviço para garantir a consistência dos dados
type Service = {
  id?: string | number;
  name: string;
  category: string;
  description: string;
  type: "recurring" | "one_time";
  price: number;
  is_active: boolean;
};

// Objeto base para um novo serviço, para resetar o formulário
const emptyService: Service = {
  name: "",
  category: "",
  description: "",
  type: "recurring",
  price: 0,
  is_active: true,
};

const ServiceManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceData, setServiceData] = useState<Service>({ ...emptyService });
  const [editingService, setEditingService] = useState<Service | null>(null);

  // A URL da API que será interceptada pelo proxy do Vite
  const API_URL = "/api/admin/services";

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar serviços");
      }
      setServices(data);
    } catch (error: unknown) {
      toast({
        title: "Erro ao carregar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpenDialog = (service: Service | null) => {
    setEditingService(service);
    setServiceData(service ? { ...service } : { ...emptyService });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setServiceData({ ...emptyService });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const method = editingService ? "PUT" : "POST";
    const url = editingService ? `${API_URL}/${editingService.id}` : API_URL;
    
    // Garantimos que o ID não seja enviado em um POST
    const bodyData = { ...serviceData };
    if (method === 'POST') {
      delete bodyData.id;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar serviço");
      }

      toast({
        title: "Sucesso!",
        description: `Serviço ${editingService ? "atualizado" : "cadastrado"} com sucesso.`,
      });

      handleCloseDialog();
      fetchServices();
    } catch (error: unknown) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string | number | undefined) => {
    if (serviceId == null) return;
    try {
      const response = await fetch(`${API_URL}/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao remover serviço");
      }

      toast({
        title: "Serviço removido!",
        description: "O serviço foi excluído com sucesso.",
      });

      fetchServices();
    } catch (error: unknown) {
      toast({
        title: "Erro ao remover",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setServiceData(prev => ({ ...prev, [id]: value }));
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite campo vazio para o usuário digitar, mas converte para 0 se for inválido
    const price = value === '' ? '' : parseFloat(value);
    setServiceData(prev => ({ ...prev, price: price === '' ? 0 : (isNaN(price as number) ? 0 : price as number) }));
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
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
              <h1 className="text-xl font-bold">Gestão de Serviços</h1>
            </div>
            <Button className="btn-hero" onClick={() => handleOpenDialog(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-8 col-span-full">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-2">Carregando serviços...</p>
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <Card key={service.id} className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <Badge variant={service.is_active ? "default" : "destructive"} className={service.is_active ? "bg-green-100 text-green-800" : ""}>
                          {service.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <p className="text-xl font-bold text-primary">
                        R$ {Number(service.price).toFixed(2)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{service.type === "recurring" ? "mês" : "único"}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" onClick={() => handleOpenDialog(service)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button size="icon" variant="destructive">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente o serviço
                              "{service.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 col-span-full">
              <p className="text-muted-foreground">Nenhum serviço cadastrado ainda.</p>
              <Button className="mt-4 btn-hero" onClick={() => handleOpenDialog(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Serviço
              </Button>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
            <form onSubmit={handleSaveService}>
              <DialogHeader>
                <DialogTitle>{editingService ? "Editar" : "Adicionar"} Serviço</DialogTitle>
                <DialogDescription>
                  {editingService ? "Altere os detalhes do serviço." : "Preencha os campos para um novo serviço."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input id="name" value={serviceData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input id="category" value={serviceData.category} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" value={serviceData.description} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Cobrança</Label>
                    <Select value={serviceData.type} onValueChange={(value) => setServiceData({ ...serviceData, type: value as Service["type"] })}>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recurring">Recorrente</SelectItem>
                        <SelectItem value="one_time">Pagamento Único</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input id="price" type="number" step="0.01" min="0" value={serviceData.price} onChange={handlePriceChange} required />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="is_active" checked={serviceData.is_active} onCheckedChange={(checked) => setServiceData({ ...serviceData, is_active: checked })} />
                  <Label htmlFor="is_active">Serviço Ativo</Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                <Button type="submit" className="btn-hero" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingService ? "Salvar Alterações" : "Adicionar Serviço"}
                </Button>
              </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;