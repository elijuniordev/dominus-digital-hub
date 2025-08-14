import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Globe, Smartphone } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    { title: "Presença Digital", description: "Sites profissionais e landing pages otimizadas", icon: Globe, badge: "Mais Popular" },
    { title: "Marketing Digital", description: "Gestão completa de redes sociais e campanhas", icon: Zap, badge: null },
    { title: "Aplicativos Mobile", description: "Apps nativos para iOS e Android com design moderno", icon: Smartphone, badge: "Novo" },
    { title: "Consultoria Digital", description: "Estratégias personalizadas para crescimento online", icon: Users, badge: null }
  ];

  return (
    <section id="servicos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções completas para estabelecer e fortalecer sua presença digital
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="card-elevated hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                {service.badge && <Badge className="mb-2 bg-secondary text-secondary-foreground w-fit mx-auto">{service.badge}</Badge>}
                <service.icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent><CardDescription className="text-center">{service.description}</CardDescription></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};