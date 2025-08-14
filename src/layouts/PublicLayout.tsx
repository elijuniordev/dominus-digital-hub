import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* O conteúdo da HomePage, BlogPage, PostPage, etc., será renderizado aqui */}
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;