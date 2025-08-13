import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceManagement = () => {
  const [services] = useState([
    { id: 1, name: "Site Profissional", price: 97.90, description: "Website responsivo e otimizado", active: true },
    { id: 2, name: "Marketing Digital", price: 97.90, description: "Gestão de redes sociais", active: true },
    { id: 3, name: "Mini-site", price: 47.90, description: "Página personalizada", active: true },
    { id: 4, name: "Consultoria", price: 97.90, description: "Consultoria especializada", active: true },
    { id: 5, name: "App Mobile", price: 197.90, description: "Aplicativo para iOS/Android", active: true }
  ]);

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
            <Button className="btn-hero">
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <Badge className={service.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {service.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{service.description}</p>
                    <p className="text-xl font-bold text-primary">R$ {service.price.toFixed(2)}/mês</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline"><Trash className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;