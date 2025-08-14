import { Link } from "react-router-dom";

const PublicFooter = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            {/* --- LOGO ATUALIZADO AQUI --- */}
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/logo.webp" 
                alt="Dominus Digital Logo" 
                className="h-28 w-auto" // Tamanho um pouco maior para o rodapé
              />
            </Link>
            <p className="text-muted-foreground">Transformando negócios através de soluções digitais inovadoras.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#servicos" className="hover:text-primary">Presença Digital</a></li>
              <li><a href="/#servicos" className="hover:text-primary">Marketing Digital</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
              <li><a href="#" className="hover:text-primary">Sobre Nós</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Portal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/portal/login" className="hover:text-primary">Login Cliente</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dominus Digital. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;