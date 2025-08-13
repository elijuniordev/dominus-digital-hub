import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Supondo que você tenha uma API em '/api/auth'
const API_URL = '/api/auth';

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Erro no login",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        
        // Redirecionamento com base no perfil do usuário, como discutimos
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/portal/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao site
        </Link>

        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient-brand">Portal do Cliente</h1>
          <p className="text-muted-foreground">Dominus Digital</p>
        </div>

        {/* Login Form */}
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Acesse seu painel de controle para gerenciar seus serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  to="#" 
                  className="text-sm text-primary hover:underline"
                >
                  Esqueci minha senha
                </Link>
                <Link 
                  to="/portal/ativacao" 
                  className="text-sm text-secondary hover:underline"
                >
                  Ativar conta
                </Link>
              </div>

              <Button 
                type="submit" 
                className="btn-hero w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar no Portal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Support Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Precisa de ajuda?</p>
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

export default ClientLogin;