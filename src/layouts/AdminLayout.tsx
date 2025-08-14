import { Outlet, Link } from 'react-router-dom';
import {
  Users,
  Settings,
  MessageSquare,
  Package,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* --- LOGO ATUALIZADO AQUI --- */}
            <Link to="/admin/dashboard" className="flex items-center">
                <img 
                  src="/assets/logo.webp" 
                  alt="Dominus Digital Logo" 
                  className="h-32 w-auto mr-4" // Ajuste o tamanho se necessário
                />
                <span className="text-muted-foreground font-semibold border-l border-border pl-4">Admin Panel</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/admin/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
              <Link to="/admin/clientes"><Button variant="ghost" size="sm">Clientes</Button></Link>
              <Link to="/admin/pedidos"><Button variant="ghost" size="sm">Pedidos</Button></Link>
              <Link to="/admin/blog"><Button variant="ghost" size="sm">Blog</Button></Link>
              <Link to="/admin/servicos"><Button variant="ghost" size="sm">Serviços</Button></Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer Aprimorado com Ações Rápidas */}
      <footer className="bg-card border-t border-border mt-auto sticky bottom-0 z-30">
        <div className="container mx-auto py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/admin/clientes">
                    <Button variant="outline" className="w-full h-full py-3 flex flex-col items-center justify-center gap-1 btn-outline-brand">
                        <Users className="w-6 h-6" />
                        <span className="text-xs font-medium">Novo Cliente</span>
                    </Button>
                </Link>
                <Link to="/admin/pedidos">
                    <Button variant="outline" className="w-full h-full py-3 flex flex-col items-center justify-center gap-1 btn-outline-brand">
                        <Package className="w-6 h-6" />
                        <span className="text-xs font-medium">Gerenciar Pedidos</span>
                    </Button>
                </Link>
                <Link to="/admin/blog">
                    <Button variant="outline" className="w-full h-full py-3 flex flex-col items-center justify-center gap-1 btn-outline-brand">
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-xs font-medium">Novo Post</span>
                    </Button>
                </Link>
                <Link to="/admin/servicos">
                    <Button variant="outline" className="w-full h-full py-3 flex flex-col items-center justify-center gap-1 btn-outline-brand">
                        <Settings className="w-6 h-6" />
                        <span className="text-xs font-medium">Ver Serviços</span>
                    </Button>
                </Link>
            </div>
        </div>
      </footer> 
    </div>
  );
};

export default AdminLayout;