import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from 'embla-carousel-react';
import { iconMap, IconName } from "@/lib/icon-map"; // Importa a lista centralizada

type Service = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  badge: string | null;
  slug: string;
};

export const ServicesSection = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 1, loop: true });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error("Não foi possível carregar os serviços.");
      }
      const data: Service[] = await response.json();
      setServices(data);
    } catch (error) {
      const desc = error instanceof Error ? error.message : "Erro desconhecido.";
      toast({ title: "Erro", description: desc, variant: "destructive" });
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const ServiceSkeleton = () => (
    <Card className="flex flex-col items-center p-6 text-center shadow-lg">
      <Skeleton className="h-16 w-16 mb-4 rounded-full" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-2" />
    </Card>
  );

  return (
    <section id="servicos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções completas para fortalecer sua presença digital.
          </p>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          {!isLoading && services.length > 1 && (
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="p-3 rounded-full bg-card shadow-md transition-opacity hover:opacity-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div className="overflow-hidden flex-1" ref={emblaRef}>
            <div className="flex -ml-4">
              {isLoading ? (
                <>
                  <div className="flex-none min-w-0 pl-4 w-full md:w-1/2 lg:w-1/3"><ServiceSkeleton /></div>
                  <div className="flex-none min-w-0 pl-4 w-full md:w-1/2 lg:w-1/3"><ServiceSkeleton /></div>
                  <div className="flex-none min-w-0 pl-4 w-full md:w-1/2 lg:w-1/3"><ServiceSkeleton /></div>
                </>
              ) : services.length > 0 ? (
                services.map((service) => {
                  const ServiceIcon = iconMap[service.icon];
                  return (
                    <div className="flex-none min-w-0 pl-4 w-full sm:w-1/2 lg:w-1/3" key={service.id}>
                      <Link to={`/servicos/${service.slug}`} className="block">
                        <Card className="relative flex flex-col items-center p-6 text-center card-elevated h-full hover:shadow-2xl transition-all duration-300">
                          {service.badge && <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">{service.badge}</Badge>}
                          {ServiceIcon && (
                            <ServiceIcon className="h-16 w-16 text-primary my-4 group-hover:scale-110 transition-transform" />
                          )}
                          <CardTitle className="text-xl font-semibold mb-2">{service.title}</CardTitle>
                          <CardContent>
                            <p className="text-muted-foreground">{service.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 col-span-full">
                  <p className="text-muted-foreground">Nenhum serviço disponível no momento.</p>
                </div>
              )}
            </div>
          </div>
          
          {!isLoading && services.length > 1 && (
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="p-3 rounded-full bg-card shadow-md transition-opacity hover:opacity-100 disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};