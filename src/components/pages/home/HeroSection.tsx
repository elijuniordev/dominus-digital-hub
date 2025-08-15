import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export const HeroSection = () => {
  const whatsappNumber = "5511972370718";
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre as soluções da Dominus Digital."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight md:leading-normal">
            Transforme Seu Negócio com
            <span className="text-gradient-brand block">Soluções Digitais</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Criamos presença digital impactante que gera resultados reais para sua empresa. 
            Do planejamento à execução, somos seu parceiro completo no mundo digital.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button className="btn-hero px-8 py-3 text-lg w-full sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Fale Conosco no WhatsApp
              </Button>
            </a>
            <a href="/#servicos">
              <Button variant="outline" className="btn-outline-brand px-8 py-3 text-lg w-full sm:w-auto">
                Conheça Nossos Serviços
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
    </section>
  );
};