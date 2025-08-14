import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Loader2, ListOrdered, Plus, Check, ChevronsUpDown, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// --- TIPAGEM ---
type OrderStatus = 'pending' | 'in_production' | 'approval_pending' | 'approved' | 'in_transit' | 'delivered' | 'canceled';
type Order = { id: string; created_at: string; order_status: OrderStatus; tracking_code: string | null; clients_info: { full_name: string } | null; services: { name: string } | null; };
type ClientInfo = { id: string; full_name: string; };
type ServiceInfo = { id: string; name: string; };
const statusMap: Record<OrderStatus, string> = {
  pending: 'Pendente', in_production: 'Em Produção', approval_pending: 'Aguardando Aprovação', approved: 'Aprovado', in_transit: 'Em Trânsito', delivered: 'Entregue / Concluído', canceled: 'Cancelado',
};
const emptyNewOrderForm = { client_id: '', service_id: '', order_status: 'pending' as OrderStatus };

// --- COMPONENTE ---
const OrdersManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editFormData, setEditFormData] = useState<{ order_status: OrderStatus; tracking_code: string }>({ order_status: 'pending', tracking_code: '' });
  const [newOrderData, setNewOrderData] = useState(emptyNewOrderForm);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);
  const [servicePopoverOpen, setServicePopoverOpen] = useState(false);

  const API_BASE_URL = "/api/admin";

  const fetchData = useCallback(async () => { setIsLoading(true); try { const [ordersRes, clientsRes, servicesRes] = await Promise.all([ fetch(`${API_BASE_URL}/orders`), fetch(`${API_BASE_URL}/clients`), fetch(`${API_BASE_URL}/services`), ]); if (!ordersRes.ok) throw new Error((await ordersRes.json()).error || "Falha ao buscar ordens."); if (!clientsRes.ok) throw new Error((await clientsRes.json()).error || "Falha ao buscar clientes."); if (!servicesRes.ok) throw new Error((await servicesRes.json()).error || "Falha ao buscar serviços."); setOrders(await ordersRes.json()); setClients(await clientsRes.json()); setServices(await servicesRes.json()); } catch (error) { toast({ title: "Erro ao Carregar Dados", description: error instanceof Error ? error.message : "Erro desconhecido.", variant: "destructive" }); } finally { setIsLoading(false); } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateOrder = async (e: React.FormEvent) => { e.preventDefault(); if (!newOrderData.client_id || !newOrderData.service_id) { toast({ title: "Campos obrigatórios", description: "Selecione um cliente e um serviço.", variant: "destructive" }); return; } setIsSaving(true); try { const response = await fetch(`${API_BASE_URL}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newOrderData) }); if (!response.ok) throw new Error((await response.json()).error || 'Erro ao criar ordem.'); toast({ title: "Sucesso!", description: "Nova ordem de serviço criada." }); setIsNewOrderDialogOpen(false); setNewOrderData(emptyNewOrderForm); await fetchData(); } catch (error) { toast({ title: "Erro ao Criar", description: error instanceof Error ? error.message : "Erro desconhecido.", variant: "destructive" }); } finally { setIsSaving(false); } };
  const handleUpdateOrder = async () => { if (!editingOrder) return; setIsSaving(true); try { const response = await fetch(`${API_BASE_URL}/orders/${editingOrder.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editFormData) }); if (!response.ok) throw new Error((await response.json()).error || 'Erro ao atualizar ordem.'); toast({ title: "Sucesso!", description: "Ordem atualizada." }); setEditingOrder(null); await fetchData(); } catch (error) { toast({ title: "Erro ao Atualizar", description: error instanceof Error ? error.message : "Erro desconhecido.", variant: "destructive" }); } finally { setIsSaving(false); } };
  const handleOpenEditDialog = (order: Order) => { setEditingOrder(order); setEditFormData({ order_status: order.order_status, tracking_code: order.tracking_code || '' }); };
  const handleDeleteOrder = async (orderId: string) => { try { const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, { method: 'DELETE' }); if (!response.ok) throw new Error('Erro ao excluir ordem.'); toast({ title: "Sucesso!", description: "Ordem excluída com sucesso." }); await fetchData(); } catch (error) { toast({ title: "Erro ao Excluir", description: error instanceof Error ? error.message : "Erro desconhecido.", variant: "destructive" }); } };
  const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => { switch (status) { case 'delivered': case 'approved': return 'default'; case 'in_transit': return 'secondary'; case 'in_production': case 'approval_pending': return 'outline'; case 'canceled': return 'destructive'; default: return 'outline'; } };
  const TableSkeleton = () => ( Array.from({ length: 5 }).map((_, index) => ( <TableRow key={index}><TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell><Skeleton className="h-5 w-40" /></TableCell><TableCell><Skeleton className="h-5 w-24" /></TableCell><TableCell><Skeleton className="h-6 w-28" /></TableCell><TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto" /></TableCell></TableRow> )) );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-bold">Gerenciamento de Pedidos e Projetos</h2><p className="text-muted-foreground">Crie e acompanhe o progresso de todos os serviços contratados.</p></div>
        <Button className="btn-hero" onClick={() => setIsNewOrderDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Nova Ordem</Button>
      </div>
      <div className="border rounded-lg"><Table><TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Serviço</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
        <TableBody>
          {isLoading ? <TableSkeleton /> : orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.clients_info?.full_name || 'N/A'}</TableCell>
                <TableCell>{order.services?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell><Badge variant={getStatusBadgeVariant(order.order_status)}>{statusMap[order.order_status]}</Badge></TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleOpenEditDialog(order)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. A ordem será permanentemente removida.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : ( <TableRow><TableCell colSpan={5} className="h-24 text-center"><ListOrdered className="mx-auto h-8 w-8 text-muted-foreground mb-2" />Nenhum pedido encontrado.</TableCell></TableRow> )}
        </TableBody>
      </Table></div>
      
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreateOrder}>
            <DialogHeader><DialogTitle>Criar Nova Ordem</DialogTitle><DialogDescription>Selecione um cliente, um serviço e o status inicial.</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Cliente</Label><Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}><PopoverTrigger asChild><Button variant="outline" role="combobox" className="w-full justify-between font-normal">{newOrderData.client_id ? clients.find(c => c.id === newOrderData.client_id)?.full_name : "Selecione..."}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Buscar cliente..." /><CommandList><CommandEmpty>Nenhum cliente.</CommandEmpty><CommandGroup>{clients.map((client) => (<CommandItem key={client.id} value={client.full_name} onSelect={() => { setNewOrderData(p => ({...p, client_id: client.id})); setClientPopoverOpen(false); }}><Check className={cn("mr-2 h-4 w-4", newOrderData.client_id === client.id ? "opacity-100" : "opacity-0")} />{client.full_name}</CommandItem>))}</CommandGroup></CommandList></Command></PopoverContent></Popover></div>
                <div className="space-y-2"><Label>Serviço</Label><Popover open={servicePopoverOpen} onOpenChange={setServicePopoverOpen}><PopoverTrigger asChild><Button variant="outline" role="combobox" className="w-full justify-between font-normal">{newOrderData.service_id ? services.find(s => s.id === newOrderData.service_id)?.name : "Selecione..."}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Buscar serviço..." /><CommandList><CommandEmpty>Nenhum serviço.</CommandEmpty><CommandGroup>{services.map((service) => (<CommandItem key={service.id} value={service.name} onSelect={() => { setNewOrderData(p => ({...p, service_id: service.id})); setServicePopoverOpen(false); }}><Check className={cn("mr-2 h-4 w-4", newOrderData.service_id === service.id ? "opacity-100" : "opacity-0")} />{service.name}</CommandItem>))}</CommandGroup></CommandList></Command></PopoverContent></Popover></div>
                <div className="space-y-2"><Label>Status Inicial</Label><Select value={newOrderData.order_status} onValueChange={(v) => setNewOrderData(p => ({...p, order_status: v as OrderStatus}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statusMap).map(([key, value]) => (<SelectItem key={key} value={key}>{value}</SelectItem>))}</SelectContent></Select></div>
            </div>
            <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button type="submit" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar Ordem</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* --- CORREÇÃO: DIALOG DE EDIÇÃO COMPLETO --- */}
      <Dialog open={!!editingOrder} onOpenChange={(isOpen) => !isOpen && setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status da Ordem</DialogTitle>
            <DialogDescription>
              Para o serviço <span className="font-semibold">{editingOrder?.services?.name}</span> do cliente <span className="font-semibold">{editingOrder?.clients_info?.full_name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="order_status">Status</Label>
              <Select value={editFormData.order_status} onValueChange={(v) => setEditFormData(p => ({...p, order_status: v as OrderStatus}))}>
                <SelectTrigger id="order_status"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(statusMap).map(([key, value]) => (<SelectItem key={key} value={key}>{value}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {(editFormData.order_status === 'in_transit' || editFormData.order_status === 'delivered') && (
              <div className="space-y-2">
                <Label htmlFor="tracking_code">Código de Rastreio</Label>
                <Input id="tracking_code" value={editFormData.tracking_code} onChange={(e) => setEditFormData(p => ({...p, tracking_code: e.target.value}))} />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
            <Button onClick={handleUpdateOrder} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;