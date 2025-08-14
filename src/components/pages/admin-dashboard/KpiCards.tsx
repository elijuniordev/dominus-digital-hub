import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Package } from "lucide-react";

type KpiData = {
  mrr: number;
  activeClients: number;
  totalOrders: number;
};

export const KpiCards = ({ kpis }: { kpis: KpiData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              {/* CORREÇÃO: Verificamos se 'kpis.mrr' é um número antes de formatá-lo */}
              <p className="text-2xl font-bold">
                R$ {typeof kpis.mrr === 'number' ? kpis.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
              </p>
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpis.activeClients || 0}</p>
              <p className="text-sm text-muted-foreground">Clientes Ativos</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpis.totalOrders || 0}</p>
              <p className="text-sm text-muted-foreground">Pedidos Totais</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};