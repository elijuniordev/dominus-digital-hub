import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Importando Textarea para o campo de notas
import { ArrowLeft, Plus, Edit, Trash, Loader2, Users, Check } from "lucide-react"; // Adicionado Check para o multiselect
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --- TIPAGEM ---

type Service = {
  id: string | number;
  name: string;
  price: number;
  type: 'recurring' | 'one_time';
};

type Contract = {
  id: string | number;
  status: string;
  monthly_total: number;
  services: { name: string };
};

type Client = {
  id: string | number;
  full_name: string;
  business_name?: string;
  phone?: string;
  email?: string;
  notes?: string;
  contracts: Contract[];
};

// Formulário para um cliente novo
type NewClientForm = {
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  billing_day: number;
  services: (string | number)[];
};

// Formulário para editar um cliente (campos limitados conforme a API)
type EditClientForm = {
  id: string | number;
  full_name: string;
  business_name: string;
  phone: string;
  notes: string;
};

// --- ESTADOS INICIAIS ---

const emptyNewClientForm: NewClientForm = {
  full_name: "",
  business_name: "",
  email: "",
  phone: "",
  billing_day: 10,
  services: [],
};


// --- COMPONENTE ---

const ClientManagement = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado para controlar se estamos criando ou editando
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Estado unificado para o formulário
  const [formData, setFormData] = useState<Partial<NewClientForm & EditClientForm>>({});

  const CLIENTS_API_URL = "/api/admin/clients";
  const SERVICES_API_URL = "/api/admin/services";

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clientsResponse, servicesResponse] = await Promise.all([
        fetch(CLIENTS_API_URL),
        fetch(SERVICES_API_URL),
      ]);
      const clientsData = await clientsResponse.json();
      if (!clientsResponse.ok) throw new Error(clientsData.error || "Erro ao carregar clientes");
      setClients(clientsData);
      
      const servicesData = await servicesResponse.json();
      if (!servicesResponse.ok) throw new Error(servicesData.error || "Erro ao carregar serviços");
      setAvailableServices(servicesData);
    } catch (error) {
      const description = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      toast({ title: "Erro ao Carregar Dados", description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenNewDialog = () => {
    setEditingClient(null);
    setFormData(emptyNewClientForm);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
        id: client.id,
        full_name: client.full_name,
        business_name: client.business_name || '',
        phone: client.phone || '',
        notes: client.notes || '',
    });
    setIsDialogOpen(true);
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isEditing = editingClient !== null;
    const url = isEditing ? `${CLIENTS_API_URL}/${editingClient.id}` : CLIENTS_API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} cliente.`);
        }
        
        toast({ title: "Sucesso!", description: `Cliente ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso.` });
        setIsDialogOpen(false);
        await fetchData();
    } catch (error) {
        const description = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
        toast({ title: "Erro ao Salvar", description, variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteClient = async (clientId: string | number) => {
    // A lógica de exclusão permanece a mesma
    try {
        const response = await fetch(`${CLIENTS_API_URL}/${clientId}`, { method: "DELETE" });
        if (!response.ok) {
            const errorData = response.status !== 204 ? await response.json() : {};
            throw new Error(errorData.error || "Erro ao remover cliente.");
        }
        toast({ title: "Cliente Removido!", description: "O cliente foi excluído com sucesso." });
        await fetchData();
    } catch (error) {
        const description = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
        toast({ title: "Erro ao Remover", description, variant: "destructive" });
    }
  };

  // Funções de atualização do formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleServicesChange = (serviceId: string | number) => {
    const currentServices = formData.services || [];
    const selected = currentServices.includes(serviceId);
    let newServices: (string | number)[];
    if (selected) {
        newServices = currentServices.filter(s => s !== serviceId);
    } else {
        newServices = [...currentServices, serviceId];
    }
    setFormData(p => ({...p, services: newServices}));
  };

  const calculateTotalMonthly = (contracts: Contract[]): number => {
    return contracts.reduce((total, contract) => total + (contract.monthly_total || 0), 0);
  }

  // --- JSX ---
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <h1 className="text-xl font-bold">Gestão de Clientes</h1>
            </div>
            <Button className="btn-hero" onClick={handleOpenNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-8 col-span-full"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <Card key={client.id} className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{client.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{client.business_name}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {client.contracts.map(c => <Badge key={c.id} variant="outline">{c.services.name}</Badge>)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" onClick={() => handleOpenEditDialog(client)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="destructive"><Trash className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteClient(client.id)}>Continuar</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">Nenhum cliente cadastrado</h3>
                <div className="mt-6"><Button className="btn-hero" onClick={handleOpenNewDialog}><Plus className="h-4 w-4 mr-2" />Cadastrar Cliente</Button></div>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => { if (isSaving) e.preventDefault(); }}>
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</DialogTitle>
              <DialogDescription>{editingClient ? 'Altere as informações do cliente abaixo.' : 'Preencha os dados para um novo cliente.'}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                {/* Campos Comuns para Criar e Editar */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo</Label>
                        <Input id="full_name" value={formData.full_name || ''} onChange={handleFormChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="business_name">Nome do Negócio</Label>
                        <Input id="business_name" value={formData.business_name || ''} onChange={handleFormChange} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={formData.phone || ''} onChange={handleFormChange} />
                </div>
                {/* Campos Apenas para Edição */}
                {editingClient && (
                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações (Admin)</Label>
                        <Textarea id="notes" value={formData.notes || ''} onChange={handleFormChange} placeholder="Adicione notas internas sobre o cliente..." />
                    </div>
                )}
                {/* Campos Apenas para Criação */}
                {!editingClient && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" value={formData.email || ''} onChange={handleFormChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Serviços Contratados</Label>
                                <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start font-normal">{(formData.services?.length || 0) > 0 ? `${formData.services?.length} selecionado(s)` : "Selecionar serviços"}</Button></PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Buscar serviço..." /><CommandList><CommandEmpty>Nenhum serviço.</CommandEmpty><CommandGroup>
                                    {availableServices.map(service => (<CommandItem key={service.id} onSelect={() => handleServicesChange(service.id)}>
                                        <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${formData.services?.includes(service.id) ? 'bg-primary text-primary-foreground' : 'opacity-50'}`}><Check className="h-4 w-4" /></div>
                                        <span>{service.name}</span>
                                    </CommandItem>))}
                                    </CommandGroup></CommandList></Command></PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="billing_day">Dia da Cobrança</Label>
                                <Input id="billing_day" type="number" min="1" max="31" value={formData.billing_day || 10} onChange={(e) => setFormData(p => ({ ...p, billing_day: parseInt(e.target.value, 10) }))} required />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={isSaving}>Cancelar</Button></DialogClose>
              <Button type="submit" className="btn-hero" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;