import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientActivation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    activationCode: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate activation code verification
    setTimeout(() => {
      if (formData.activationCode.length >= 6) {
        setStep(2);
        toast({
          title: "Código validado!",
          description: "Agora configure sua senha de acesso.",
        });
      } else {
        toast({
          title: "Código inválido",
          description: "Verifique o código e tente novamente.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas devem ser idênticas.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha muito fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate account activation
    setTimeout(() => {
      setStep(3);
      setIsLoading(false);
    }, 2000);
  };

  const handleFinish = () => {
    toast({
      title: "Conta ativada com sucesso!",
      description: "Redirecionando para o portal...",
    });
    navigate("/portal/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Link 
          to="/portal/login" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao login
        </Link>

        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient-brand">Ativação de Conta</h1>
          <p className="text-muted-foreground">Dominus Digital</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            3
          </div>
        </div>

        {/* Step 1: Activation Code */}
        {step === 1 && (
          <Card className="card-elevated">
            <CardHeader className="text-center">
              <CardTitle>Código de Ativação</CardTitle>
              <CardDescription>
                Digite o código de ativação que você recebeu por e-mail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleActivationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activationCode">Código de Ativação</Label>
                  <Input
                    id="activationCode"
                    type="text"
                    placeholder="Digite o código"
                    value={formData.activationCode}
                    onChange={(e) => setFormData({...formData, activationCode: e.target.value})}
                    className="text-center text-lg tracking-widest"
                    maxLength={12}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Verifique sua caixa de entrada e spam
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="btn-hero w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Verificando..." : "Verificar Código"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Password Setup */}
        {step === 2 && (
          <Card className="card-elevated">
            <CardHeader className="text-center">
              <CardTitle>Criar Senha</CardTitle>
              <CardDescription>
                Configure uma senha segura para acessar seu portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Sua senha deve ter:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pelo menos 6 caracteres</li>
                    <li>Letras e números</li>
                    <li>Caracteres especiais (recomendado)</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="btn-hero w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Card className="card-elevated">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Conta Ativada!</h2>
              
              <p className="text-muted-foreground mb-6">
                Sua conta foi ativada com sucesso. Agora você pode acessar 
                todos os recursos do portal do cliente.
              </p>

              <div className="space-y-4">
                <Button 
                  onClick={handleFinish}
                  className="btn-hero w-full"
                >
                  Acessar Portal
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  <p>Seus dados de acesso:</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Não recebeu o código?</p>
          <p>
            Entre em contato: 
            <a 
              href="mailto:suporte@dominusdigital.com" 
              className="text-primary hover:underline ml-1"
            >
              suporte@dominusdigital.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientActivation;