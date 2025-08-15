import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { iconMap, IconName } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  badge: string | null;
};

const ServicePage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchService = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/services/${id}`);
      if (response.status === 404) {
        toast({ title: "Serviço não encontrado", variant: "destructive" });
        navigate("/servicos"); // Redireciona para a página de serviços se não encontrar
        return;
      }
      if (!response.ok) throw new Error("Não foi possível carregar o serviço.");
      const data: Service = await response.json();
      setService(data);
    } catch (error) {
      toast({ title: "Erro", description: error instanceof Error ? error.message : "Erro.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const ServiceSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <Skeleton className="h-6 w-40 mb-8" />
      <Skeleton className="h-16 w-16 mb-4 rounded-full" />
      <Skeleton className="h-10 w-3/4 mb-2" />
      <Skeleton className="h-6 w-full mb-8" />
      <Skeleton className="h-5 w-full mb-3" />
      <Skeleton className="h-5 w-5/6" />
    </div>
  );

  if (isLoading) {
    return (
      <main className="flex-grow">
        <ServiceSkeleton />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-2xl font-bold">Serviço não encontrado</h2>
          <p className="text-muted-foreground mt-2">O link pode estar quebrado ou o serviço foi removido.</p>
          <Button asChild className="mt-6">
            <Link to="/servicos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para os serviços
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const ServiceIcon = iconMap[service.icon];

  return (
    <main className="flex-grow py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link to="/servicos" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para todos os serviços
        </Link>
        <Card className="card-elevated p-8">
          {service.badge && (
            <Badge className="mb-4 bg-secondary text-secondary-foreground">{service.badge}</Badge>
          )}
          <div className="flex items-center space-x-6 mb-4">
            {ServiceIcon && (
              <ServiceIcon className="h-16 w-16 text-primary" />
            )}
            <CardTitle className="text-4xl font-bold">{service.title}</CardTitle>
          </div>
          <CardContent className="px-0">
            <p className="text-lg text-foreground leading-relaxed">{service.description}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ServicePage;