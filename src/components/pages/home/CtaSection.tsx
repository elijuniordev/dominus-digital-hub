import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para Transformar Seu Negócio?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Entre em contato conosco e descubra como podemos ajudar sua empresa 
          a alcançar resultados extraordinários no mundo digital.
        </p>
        <Button 
          className="bg-background text-primary hover:bg-background/90 px-8 py-3 text-lg font-semibold"
        >
          Solicitar Consultoria Gratuita
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};