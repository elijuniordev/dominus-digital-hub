import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Service = {
  id: string | number;
  name: string;
  type?: string;
};

type Contract = {
  id: string | number;
  service_id: string | number;
  service?: Service | null;
  billing_day?: string;
  status?: string;
  monthly_total?: number;
};

type Client = {
  id: string | number;
  full_name: string;
  business_name?: string;
  phone?: string;
  user_id: string;
  email: string;
  contracts?: Contract[];
};

const emptyClient: Client = {
  id: "",
  full_name: "",
  user_id: "",
  email: "",
  contracts: [],
};

const ClientManagement = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Client>({ ...emptyClient });
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/admin/clients";

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao carregar clientes");
      const data: Client[] = await res.json();

      setClients(
        data.map(client => ({
          ...client,
          contracts: client.contracts || [],
        }))
      );
    } catch (error) {
      toast({
        title: "Erro",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setNewClient(client);
    setIsNewClientDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string | number) => {
    try {
      const res = await fetch(`${API_URL}/clients/${clientId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao remover cliente");
      toast({ title: "Cliente removido!", description: "Cliente excluído com sucesso." });
      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSaveClient = async () => {
    try {
      const method = editingClient ? "PUT" : "POST";
      const url = editingClient ? `${API_URL}/clients/${editingClient.id}` : `${API_URL}/clients`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar cliente");
      }

      toast({
        title: "Sucesso!",
        description: `Cliente ${editingClient ? "editado" : "cadastrado"} com sucesso.`,
      });

      setIsNewClientDialogOpen(false);
      setEditingClient(null);
      setNewClient({ ...emptyClient });
      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // ===================== COMPONENTES DE RENDER =====================
  const renderClientCard = (client: Client) => (
    <Card key={client.id} className="card-elevated">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold">{client.full_name}</h3>
              <Badge
                className={
                  client.contracts?.some(c => c.status === "active")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {client.contracts?.some(c => c.status === "active") ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">{client.email}</p>
            {client.phone && <p className="text-muted-foreground mb-2">📞 {client.phone}</p>}
            {client.business_name && <p className="text-muted-foreground mb-2">🏢 {client.business_name}</p>}
            {client.contracts && client.contracts.length > 0 && (
              <p className="text-muted-foreground mb-2">
                Serviços: {client.contracts.map(c => c.service?.name).join(", ")}
              </p>
            )}
            <p className="text-xl font-bold text-primary">
              Total Mensal: R${" "}
              {client.contracts?.reduce((acc, c) => acc + (c.monthly_total || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => handleEditClick(client)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDeleteClient(client.id)}>
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderClientsList = () => {
    if (isLoading)
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      );

    if (clients.length === 0)
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum cliente cadastrado ainda.</p>
        </div>
      );

    return clients.map(renderClientCard);
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
              <h1 className="text-xl font-bold">Gestão de Clientes</h1>
            </div>

            <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingClient ? "Editar" : "Adicionar"} Cliente</DialogTitle>
                  <DialogDescription>
                    {editingClient ? "Altere os detalhes do cliente." : "Preencha os campos para adicionar um novo cliente."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newClient.full_name}
                      onChange={e => setNewClient({ ...newClient, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={newClient.email}
                      onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newClient.phone || ""}
                      onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Empresa</Label>
                    <Input
                      id="business_name"
                      value={newClient.business_name || ""}
                      onChange={e => setNewClient({ ...newClient, business_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsNewClientDialogOpen(false);
                      setEditingClient(null);
                      setNewClient({ ...emptyClient });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveClient} className="btn-hero">
                    {editingClient ? "Salvar Alterações" : "Adicionar Cliente"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">{renderClientsList()}</div>
      </div>
    </div>
  );
};

export default ClientManagement;
