import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calendar, 
  Download, 
  ArrowLeft, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const ClientBilling = () => {
  // Mock billing data
  const billingInfo = {
    currentPlan: "Plano Completo",
    monthlyTotal: 297.90,
    billingDay: 15,
    nextBillingDate: "15 Fev 2024",
    paymentMethod: "Cartão de Crédito •••• 4532",
    status: "Em Dia"
  };

  const invoices = [
    {
      id: "INV-2024-001",
      date: "15 Jan 2024",
      amount: 297.90,
      status: "Pago",
      services: ["Site Profissional", "Marketing Digital", "Mini-site", "Consultoria"],
      dueDate: "20 Jan 2024",
      paidDate: "18 Jan 2024"
    },
    {
      id: "INV-2023-012",
      date: "15 Dez 2023",
      amount: 297.90,
      status: "Pago",
      services: ["Site Profissional", "Marketing Digital", "Mini-site", "Consultoria"],
      dueDate: "20 Dez 2023",
      paidDate: "19 Dez 2023"
    },
    {
      id: "INV-2023-011",
      date: "15 Nov 2023",
      amount: 297.90,
      status: "Pago",
      services: ["Site Profissional", "Marketing Digital", "Mini-site", "Consultoria"],
      dueDate: "20 Nov 2023",
      paidDate: "20 Nov 2023"
    },
    {
      id: "INV-2023-010",
      date: "15 Out 2023",
      amount: 297.90,
      status: "Pago",
      services: ["Site Profissional", "Marketing Digital", "Mini-site"],
      dueDate: "20 Out 2023",
      paidDate: "17 Out 2023"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pago":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pago
          </Badge>
        );
      case "Pendente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "Vencido":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Vencido
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/portal/dashboard"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="text-gradient-brand font-bold">Portal do Cliente</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Cobrança e Faturas</h1>
            <p className="text-muted-foreground">
              Gerencie suas faturas e informações de pagamento
            </p>
          </div>

          {/* Billing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">R$ {billingInfo.monthlyTotal.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Valor Mensal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Dia {billingInfo.billingDay}</p>
                    <p className="text-sm text-muted-foreground">Data de Cobrança</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{billingInfo.status}</p>
                    <p className="text-sm text-muted-foreground">Status da Conta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Plan */}
          <Card className="card-elevated mb-8">
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>
                Detalhes do seu plano e próxima cobrança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{billingInfo.currentPlan}</h3>
                    <p className="text-3xl font-bold text-gradient-brand">
                      R$ {billingInfo.monthlyTotal.toFixed(2)}
                      <span className="text-base font-normal text-muted-foreground">/mês</span>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Serviços Inclusos:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Site Profissional Responsivo</li>
                      <li>• Gestão de Marketing Digital</li>
                      <li>• Mini-site Personalizado</li>
                      <li>• Consultoria Digital Mensal</li>
                      <li>• Suporte Técnico Prioritário</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Próxima Cobrança</h4>
                    <p className="text-lg font-semibold">{billingInfo.nextBillingDate}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {billingInfo.monthlyTotal.toFixed(2)} via {billingInfo.paymentMethod}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="btn-outline-brand flex-1">
                      Alterar Plano
                    </Button>
                    <Button variant="outline" className="btn-outline-brand flex-1">
                      Atualizar Pagamento
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices History */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Histórico de Faturas</CardTitle>
                  <CardDescription>
                    Todas as suas faturas e comprovantes de pagamento
                  </CardDescription>
                </div>
                <Button variant="outline" className="btn-outline-brand">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium">{invoice.id}</h4>
                        {getStatusBadge(invoice.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Data da Fatura: {invoice.date}</p>
                        <p>Vencimento: {invoice.dueDate}</p>
                        {invoice.paidDate && (
                          <p>Pago em: {invoice.paidDate}</p>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Serviços:</p>
                        <div className="flex flex-wrap gap-1">
                          {invoice.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-xl font-bold">
                        R$ {invoice.amount.toFixed(2)}
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-6">
                <Button variant="outline" className="btn-outline-brand">
                  Carregar Mais Faturas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="card-elevated mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Dúvidas sobre sua Cobrança?</h3>
                <p className="text-muted-foreground mb-4">
                  Nossa equipe está pronta para ajudar com questões financeiras e de faturamento.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" className="btn-outline-brand">
                    Chat de Suporte
                  </Button>
                  <Button className="btn-hero">
                    Falar com Financeiro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientBilling;