import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    { name: "Maria Silva", company: "Estética Bella", content: "A Dominus Digital transformou completamente minha presença online. Triplicamos nossos agendamentos!", rating: 5 },
    { name: "João Santos", company: "Auto Peças JR", content: "Excelente suporte e resultados incríveis. Recomendo para qualquer empresa.", rating: 5 },
    { name: "Ana Oliveira", company: "Advocacia & Consultoria", content: "Profissionais extremamente competentes. Nosso site ficou lindo e funcional.", rating: 5 }
  ];

  return (
    <section id="depoimentos" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de empresas que transformaram seus resultados conosco
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="card-brand p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 text-secondary fill-current" />)}
                </div>
                <p className="text-foreground italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};