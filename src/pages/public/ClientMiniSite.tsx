import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Share2,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientMiniSite = () => {
  const { clientId } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock client data - In real app, this would be fetched based on clientId
  const clientData = {
    id: clientId,
    businessName: "Estética Bella Vita",
    owner: "Maria Silva Santos",
    logo: "", // Would be a real logo URL
    biography: "Especialista em estética facial e corporal há mais de 10 anos. Oferecemos tratamentos personalizados com as mais modernas técnicas do mercado, sempre priorizando o bem-estar e a beleza natural de nossos clientes.",
    phone: "(11) 9 8765-4321",
    email: "contato@esteticabellavita.com.br",
    address: "Rua das Flores, 123 - Centro - São Paulo/SP",
    hours: {
      "Segunda": "09:00 - 18:00",
      "Terça": "09:00 - 18:00", 
      "Quarta": "09:00 - 18:00",
      "Quinta": "09:00 - 18:00",
      "Sexta": "09:00 - 18:00",
      "Sábado": "09:00 - 15:00",
      "Domingo": "Fechado"
    },
    socialMedia: {
      instagram: "@esteticabellavita",
      facebook: "Estética Bella Vita",
      website: "www.esteticabellavita.com.br"
    },
    services: [
      "Limpeza de Pele",
      "Hidratação Facial",
      "Massagem Relaxante",
      "Drenagem Linfática",
      "Tratamento Anti-idade"
    ],
    theme: {
      primaryColor: "#8B5CF6", // Purple
      secondaryColor: "#F97316" // Orange
    }
  };

  const handleSaveContact = async () => {
    setIsLoading(true);
    
    // Create vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${clientData.businessName}
ORG:${clientData.businessName}
TEL:${clientData.phone}
EMAIL:${clientData.email}
ADR:;;${clientData.address};;;;
URL:${clientData.socialMedia.website}
NOTE:${clientData.biography}
END:VCARD`;

    try {
      // For mobile devices, try to trigger native contact app
      if ('contacts' in navigator && 'ContactsManager' in window) {
        // This is experimental and may not work on all devices
        toast({
          title: "Salvando contato...",
          description: "Abrindo aplicativo de contatos do dispositivo.",
        });
      } else {
        // Fallback: create downloadable vCard file
        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${clientData.businessName.replace(/\s+/g, '_')}.vcf`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Contato salvo!",
          description: "O arquivo de contato foi baixado. Importe-o em seu aplicativo de contatos.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar contato",
        description: "Tente novamente ou anote as informações manualmente.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleOpenMap = () => {
    const encodedAddress = encodeURIComponent(clientData.address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapUrl, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: clientData.businessName,
      text: `Conheça ${clientData.businessName} - ${clientData.biography.substring(0, 100)}...`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const dayKey = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);
    const todayHours = clientData.hours[dayKey as keyof typeof clientData.hours];
    
    if (todayHours === "Fechado") {
      return { status: "Fechado", color: "destructive" };
    }
    
    const [open, close] = todayHours.split(" - ");
    if (currentTime >= open && currentTime <= close) {
      return { status: "Aberto agora", color: "secondary" };
    }
    
    return { status: "Fechado agora", color: "destructive" };
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header with Share Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-sm text-muted-foreground">Dominus Digital</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        {/* Business Logo and Name */}
        <Card className="card-elevated mb-6">
          <CardContent className="text-center py-8">
            {/* Logo Placeholder */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">
                {clientData.businessName.charAt(0)}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gradient-brand mb-2">
              {clientData.businessName}
            </h1>
            
            <p className="text-muted-foreground mb-4">
              {clientData.owner}
            </p>
            
            <div className="flex justify-center">
              <Badge 
                variant={currentStatus.color as "secondary" | "destructive"}
                className="text-sm"
              >
                <Clock className="h-3 w-3 mr-1" />
                {currentStatus.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Biography */}
        <Card className="card-elevated mb-6">
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-3">Sobre Nós</h2>
            <p className="text-muted-foreground leading-relaxed">
              {clientData.biography}
            </p>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="card-elevated mb-6">
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-4">Nossos Serviços</h2>
            <div className="flex flex-wrap gap-2">
              {clientData.services.map((service, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card className="card-elevated mb-6">
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Horário de Funcionamento
            </h2>
            <div className="space-y-2">
              {Object.entries(clientData.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="font-medium">{day}</span>
                  <span className={`text-sm ${hours === "Fechado" ? "text-muted-foreground" : "text-foreground"}`}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="card-elevated mb-6">
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-4">Contato</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <a 
                  href={`tel:${clientData.phone}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {clientData.phone}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href={`mailto:${clientData.email}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {clientData.email}
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-foreground">
                  {clientData.address}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="card-elevated mb-8">
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold mb-4">Redes Sociais</h2>
            <div className="flex space-x-4">
              <a 
                href={`https://instagram.com/${clientData.socialMedia.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span>{clientData.socialMedia.instagram}</span>
              </a>
              
              <a 
                href={`https://facebook.com/${clientData.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleOpenMap}
            className="btn-outline-brand flex-1"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Abrir no Maps
          </Button>
          
          <Button 
            onClick={handleSaveContact}
            className="btn-hero flex-1"
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Contato"}
          </Button>
        </div>

        {/* Powered by */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Powered by{" "}
            <span className="text-gradient-brand font-semibold">
              Dominus Digital
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientMiniSite;