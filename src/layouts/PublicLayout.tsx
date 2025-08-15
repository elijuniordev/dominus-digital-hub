import { Outlet } from "react-router-dom";
import PublicHeader from "@/components/layout/PublicHeader"; // CORRIGIDO: Importação padrão
import PublicFooter from "@/components/layout/PublicFooter"; // CORRIGIDO: Importação padrão

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;