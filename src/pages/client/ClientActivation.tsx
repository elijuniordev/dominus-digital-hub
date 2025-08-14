import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

const ClientActivation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados do formulário
  const [activationKey, setActivationKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de controle da UI
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Efeito para ler a chave de ativação da URL assim que a página carregar
  useEffect(() => {
    const keyFromUrl = searchParams.get('key');
    if (keyFromUrl) {
      setActivationKey(keyFromUrl);
    }
  }, [searchParams]);

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação no frontend
    if (!activationKey) {
      setError('A chave de ativação é obrigatória.');
      return;
    }
    if (password.length < 6) {
      setError('Sua senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsActivating(true);
    try {
      const response = await fetch('/api/public/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activation_key: activationKey,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Não foi possível ativar a conta.');
      }

      // Se a ativação for bem-sucedida
      setIsSuccess(true);
      toast({
        title: "Conta Ativada com Sucesso!",
        description: "Você já pode fazer o login com sua nova senha.",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(errorMessage);
    } finally {
      setIsActivating(false);
    }
  };
  
  // Se a ativação foi um sucesso, exibe uma mensagem de confirmação
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Ativação Concluída!</CardTitle>
            <CardDescription>Sua conta foi ativada e sua senha definida com sucesso.</CardDescription>
          </CardHeader>
          <CardContent>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <p className="text-muted-foreground mb-6">
              Agora você pode acessar o portal do cliente para gerenciar seus serviços.
            </p>
            <Button asChild className="w-full btn-hero">
              <Link to="/portal/login">Ir para o Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulário de ativação
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Ative sua Conta</CardTitle>
          <CardDescription>
            Defina uma senha para acessar o Portal do Cliente pela primeira vez.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleActivation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activation-key">Chave de Ativação</Label>
              <Input
                id="activation-key"
                type="text"
                placeholder="Cole sua chave de ativação aqui"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                required
                // Se a chave veio da URL, o campo fica apenas para leitura
                readOnly={!!searchParams.get('key')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme a Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full btn-hero" disabled={isActivating}>
              {isActivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ativar Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientActivation;