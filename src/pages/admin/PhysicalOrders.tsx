import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const PhysicalOrders = () => {
  const orders = [
    { id: 1, client: "Estética Bella", product: "Placa Digital QR Code", status: "Produção", date: "15 Jan 2024" },
    { id: 2, client: "Auto Peças JR", product: "Placa Personalizada", status: "Design", date: "14 Jan 2024" },
    { id: 3, client: "Advocacia Silva", product: "Placa Premium", status: "Enviado", date: "10 Jan 2024" }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      "Design": "bg-purple-100 text-purple-800",
      "Produção": "bg-blue-100 text-blue-800", 
      "Enviado": "bg-green-100 text-green-800"
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/admin/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <h1 className="text-xl font-bold">Pedidos Físicos</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Pedidos de Placas
            </CardTitle>
            <CardDescription>Acompanhamento de produção e envio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">{order.client}</h3>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(order.status)}
                    <Button size="sm" variant="outline">Detalhes</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhysicalOrders;