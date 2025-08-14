import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importação do novo Layout de Admin
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Importação de todas as suas páginas
import HomePage from "./pages/public/HomePage";
import BlogPage from "./pages/public/BlogPage";
import ClientMiniSite from "./pages/public/ClientMiniSite";
import ClientLogin from "./pages/client/ClientLogin";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientActivation from "./pages/client/ClientActivation";
import ClientMiniSiteEditor from "./pages/client/ClientMiniSiteEditor";
import ClientBilling from "./pages/client/ClientBilling";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientManagement from "./pages/admin/ClientManagement";
import ServiceManagement from "./pages/admin/ServiceManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import NotFound from "./pages/NotFound";
import OrdersManagement from "./pages/admin/OrdersManagement";
import PostPage from "./pages/public/PostPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas - Sem layout de admin */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/cliente/:clientId" element={<ClientMiniSite />} />
            <Route path="/blog/:slug" element={<PostPage />} />
          </Route>
          
          {/* Rotas do Portal do Cliente - Sem layout de admin */}
          <Route path="/portal/login" element={<ClientLogin />} />
          <Route path="/portal/ativacao" element={<ClientActivation />} />
          <Route path="/portal/dashboard" element={<ClientDashboard />} />
          <Route path="/portal/personalizar" element={<ClientMiniSiteEditor />} />
          <Route path="/portal/cobranca" element={<ClientBilling />} />
          
          {/* GRUPO DE ROTAS DO ADMIN - Todas usam o AdminLayout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/clientes" element={<ClientManagement />} />
            <Route path="/admin/servicos" element={<ServiceManagement />} />
            <Route path="/admin/pedidos" element={<OrdersManagement />} />
            <Route path="/admin/blog" element={<BlogManagement />} />
          </Route>
          
          {/* Rota "não encontrada" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;