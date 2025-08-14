// src/components/pages/admin-dashboard/OrdersStatus.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Tipagem para os dados de status
type OrdersByStatusData = {
  [status: string]: number;
};

// O componente recebe os dados como props
export const OrdersStatus = ({ ordersByStatus }: { ordersByStatus: OrdersByStatusData }) => {
  // Mapeia os nomes técnicos para nomes legíveis
  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    in_production: 'Em Produção',
    approval_pending: 'Aguardando Aprovação',
    approved: 'Aprovado',
    in_transit: 'Em Trânsito',
    delivered: 'Entregue / Concluído',
    canceled: 'Cancelado',
  };

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Status dos Pedidos</CardTitle>
        <p className="text-sm text-muted-foreground">Acompanhamento de todos os pedidos.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(ordersByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center">
              <span className="text-sm font-medium capitalize flex-1">
                {statusMap[status] || status}
              </span>
              <span className="text-sm text-muted-foreground font-semibold">
                {count} pedido(s)
              </span>
            </div>
          ))}
          {Object.keys(ordersByStatus).length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};