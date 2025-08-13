import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import PhysicalOrders from "./pages/admin/PhysicalOrders";
import BlogManagement from "./pages/admin/BlogManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/cliente/:clientId" element={<ClientMiniSite />} />
          
          {/* Client Portal */}
          <Route path="/portal/login" element={<ClientLogin />} />
          <Route path="/portal/ativacao" element={<ClientActivation />} />
          <Route path="/portal/dashboard" element={<ClientDashboard />} />
          <Route path="/portal/personalizar" element={<ClientMiniSiteEditor />} />
          <Route path="/portal/cobranca" element={<ClientBilling />} />
          
          {/* Admin Portal */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clientes" element={<ClientManagement />} />
          <Route path="/admin/servicos" element={<ServiceManagement />} />
          <Route path="/admin/placas" element={<PhysicalOrders />} />
          <Route path="/admin/blog" element={<BlogManagement />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;