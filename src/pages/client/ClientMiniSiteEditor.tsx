import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Save, 
  Eye, 
  ArrowLeft, 
  Clock, 
  Instagram, 
  Facebook, 
  Palette,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ClientMiniSiteEditor = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "Estética Bella Vita",
    owner: "Maria Silva Santos",
    biography: "Especialista em estética facial e corporal há mais de 10 anos. Oferecemos tratamentos personalizados com as mais modernas técnicas do mercado, sempre priorizando o bem-estar e a beleza natural de nossos clientes.",
    phone: "(11) 9 8765-4321",
    email: "contato@esteticabellavita.com.br",
    address: "Rua das Flores, 123 - Centro - São Paulo/SP",
    instagram: "@esteticabellavita",
    facebook: "Estética Bella Vita",
    website: "www.esteticabellavita.com.br",
    primaryColor: "#8B5CF6",
    secondaryColor: "#F97316"
  });

  const [hours, setHours] = useState({
    "Segunda": "09:00 - 18:00",
    "Terça": "09:00 - 18:00",
    "Quarta": "09:00 - 18:00", 
    "Quinta": "09:00 - 18:00",
    "Sexta": "09:00 - 18:00",
    "Sábado": "09:00 - 15:00",
    "Domingo": "Fechado"
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate save process
    setTimeout(() => {
      toast({
        title: "Alterações salvas!",
        description: "Seu mini-site foi atualizado com sucesso.",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 2MB.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Logo carregado!",
        description: "Sua logo foi carregada com sucesso.",
      });
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
            
            <div className="flex items-center space-x-4">
              <Link to="/cliente/maria-silva" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
              </Link>
              <Button 
                onClick={handleSave}
                className="btn-hero"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Personalizar Mini-site</h1>
            <p className="text-muted-foreground">
              Configure as informações que aparecerão no seu mini-site público
            </p>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="hours">Horários</TabsTrigger>
              <TabsTrigger value="social">Redes Sociais</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Logo e Identificação</CardTitle>
                  <CardDescription>
                    Configure a logo e nome do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Logo da Empresa</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {formData.businessName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload">
                          <Button variant="outline" className="btn-outline-brand cursor-pointer" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Carregar Logo
                            </span>
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG até 2MB. Recomendado: 200x200px
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nome da Empresa</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="owner">Proprietário/Responsável</Label>
                      <Input
                        id="owner"
                        value={formData.owner}
                        onChange={(e) => setFormData({...formData, owner: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biography">Biografia/Sobre a Empresa</Label>
                    <Textarea
                      id="biography"
                      rows={4}
                      value={formData.biography}
                      onChange={(e) => setFormData({...formData, biography: e.target.value})}
                      placeholder="Descreva sua empresa, serviços e diferenciais..."
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.biography.length}/500 caracteres
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>
                    Dados para que os clientes entrem em contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(11) 9 9999-9999"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="contato@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Rua, número - Bairro - Cidade/Estado"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Operating Hours Tab */}
            <TabsContent value="hours" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Horário de Funcionamento
                  </CardTitle>
                  <CardDescription>
                    Configure os horários de cada dia da semana
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium">{day}</div>
                      <Input
                        value={time}
                        onChange={(e) => setHours({...hours, [day]: e.target.value})}
                        placeholder="09:00 - 18:00 ou Fechado"
                        className="flex-1"
                      />
                    </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Dicas:</strong> Use o formato "09:00 - 18:00" para horários de funcionamento 
                      ou digite "Fechado" para dias sem atendimento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                  <CardDescription>
                    Links para suas redes sociais e website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center">
                      <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      placeholder="@seuinstagram"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="flex items-center">
                      <Facebook className="h-4 w-4 mr-2 text-blue-500" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                      placeholder="Nome da página no Facebook"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-green-500" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="www.seusite.com"
                    />
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Dica:</strong> As redes sociais ajudam os clientes a encontrar e seguir 
                      seu negócio. Mantenha sempre atualizadas!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Personalização Visual
                  </CardTitle>
                  <CardDescription>
                    Customize as cores do seu mini-site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Cor Principal</Label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                          className="w-12 h-10 rounded border border-border cursor-pointer"
                        />
                        <Input
                          value={formData.primaryColor}
                          onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                          placeholder="#8B5CF6"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          id="secondaryColor"
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                          className="w-12 h-10 rounded border border-border cursor-pointer"
                        />
                        <Input
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                          placeholder="#F97316"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="space-y-4">
                    <Label>Visualização das Cores</Label>
                    <div className="p-6 rounded-lg border border-border" style={{ 
                      background: `linear-gradient(135deg, ${formData.primaryColor}10, ${formData.secondaryColor}10)` 
                    }}>
                      <div className="flex items-center space-x-4 mb-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` }}
                        >
                          <span className="text-white font-bold text-xl">
                            {formData.businessName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{formData.businessName}</h3>
                          <p className="text-muted-foreground">{formData.owner}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Badge style={{ backgroundColor: formData.primaryColor, color: 'white' }}>
                          Cor Principal
                        </Badge>
                        <Badge style={{ backgroundColor: formData.secondaryColor, color: 'white' }}>
                          Cor Secundária
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Dica:</strong> Escolha cores que representem sua marca e tenham 
                      boa legibilidade. As cores padrão da Dominus Digital são uma boa opção!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button (Fixed) */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSave}
              className="btn-hero px-8"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando Alterações..." : "Salvar Todas as Alterações"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientMiniSiteEditor;