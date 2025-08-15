import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
// Removidas as importações de useTheme, Switch, Lightbulb e Moon

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* --- LOGO ATUALIZADO AQUI --- */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/logo.webp" 
              alt="Dominus Digital Logo" 
              className="h-32 w-auto"
            />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Início</Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">Blog</Link>
            <a href="/#servicos" className="text-foreground hover:text-primary transition-colors">Serviços</a>
            <a href="/#depoimentos" className="text-foreground hover:text-primary transition-colors">Depoimentos</a>
            <Link to="/portal/login" className="btn-outline-brand px-4 py-2 rounded-lg font-medium">Portal do Cliente</Link>
          </nav>

          {/* Botão do Menu Mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Navegação Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Início</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <a href="/#servicos" onClick={() => setIsMenuOpen(false)}>Serviços</a>
              <a href="/#depoimentos" onClick={() => setIsMenuOpen(false)}>Depoimentos</a>
              <Link to="/portal/login" className="btn-outline-brand px-4 py-2 rounded-lg font-medium text-center" onClick={() => setIsMenuOpen(false)}>
                Portal do Cliente
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;