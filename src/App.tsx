// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from './theme-provider'; // Importar ThemeProvider
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/public/HomePage';
import PostPage from './pages/public/PostPage';
import BlogPage from './pages/public/BlogPage';
import ClientMiniSite from './pages/public/ClientMiniSite';
import NotFound from './pages/NotFound';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientActivation from './pages/client/ClientActivation';
import ClientBilling from './pages/client/ClientBilling';
import ClientLogin from './pages/client/ClientLogin';
import ClientMiniSiteEditor from './pages/client/ClientMiniSiteEditor';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlogManagement from './pages/admin/BlogManagement';
import ClientManagement from './pages/admin/ClientManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import ServiceManagement from './pages/admin/ServiceManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Adicionar ThemeProvider para gerenciar o tema em toda a aplicação */}
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas com o PublicLayout */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<PostPage />} />
              <Route path="minisite/:clientSlug" element={<ClientMiniSite />} />
            </Route>

            {/* Rotas da Área do Cliente */}
            <Route path="/cliente" element={<PublicLayout />}>
              <Route path="login" element={<ClientLogin />} />
              <Route path="ativacao" element={<ClientActivation />} />
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="faturamento" element={<ClientBilling />} />
              <Route path="editor" element={<ClientMiniSiteEditor />} />
            </Route>

            {/* Rotas da Área Admin com o AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="clientes" element={<ClientManagement />} />
              <Route path="pedidos" element={<OrdersManagement />} />
              <Route path="servicos" element={<ServiceManagement />} />
            </Route>

            {/* Catch-all para rotas não encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;