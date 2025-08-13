-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'client');

-- Create enum for service types
CREATE TYPE public.service_type AS ENUM ('one_time', 'recurring');

-- Create enum for contract status
CREATE TYPE public.contract_status AS ENUM ('active', 'inactive', 'suspended', 'cancelled');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create enum for blog post status
CREATE TYPE public.blog_status AS ENUM ('draft', 'published', 'archived');

-- Create enum for notification types
CREATE TYPE public.notification_type AS ENUM ('billing', 'service', 'system', 'promotion');

-- Create enum for notification status
CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'failed');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clients_info table
CREATE TABLE public.clients_info (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT,
    cpf_cnpj TEXT,
    activation_key TEXT UNIQUE,
    mini_site_url TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create services table
CREATE TABLE public.services (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    type service_type NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contracts table
CREATE TABLE public.contracts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients_info(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    status contract_status NOT NULL DEFAULT 'active',
    contract_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    billing_day INTEGER CHECK (billing_day >= 1 AND billing_day <= 31),
    next_billing_date DATE,
    monthly_total DECIMAL(10,2),
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(client_id, service_id)
);

-- Create mini_site_data table
CREATE TABLE public.mini_site_data (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients_info(id) ON DELETE CASCADE,
    logo_url TEXT,
    biography TEXT,
    business_title TEXT,
    colors JSONB DEFAULT '{"primary": "#FF6B35", "secondary": "#8B5CF6"}',
    social_media_links JSONB DEFAULT '{}',
    operating_hours JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(client_id)
);

-- Create physical_orders table
CREATE TABLE public.physical_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients_info(id) ON DELETE CASCADE,
    tracking_code TEXT UNIQUE,
    order_status order_status NOT NULL DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_categories table
CREATE TABLE public.blog_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    featured_image_url TEXT,
    status blog_status NOT NULL DEFAULT 'draft',
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients_info(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status notification_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    details JSONB DEFAULT '{}'
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mini_site_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Create function to get client_id from user_id
CREATE OR REPLACE FUNCTION public.get_client_id(user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.clients_info WHERE user_id = user_id;
$$;

-- RLS Policies for users table
CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (id = auth.uid());

-- RLS Policies for clients_info table
CREATE POLICY "Admins can manage all clients" ON public.clients_info
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients can view their own info" ON public.clients_info
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Clients can update their own info" ON public.clients_info
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for services table
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all services" ON public.services
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for contracts table
CREATE POLICY "Admins can manage all contracts" ON public.contracts
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients can view their own contracts" ON public.contracts
  FOR SELECT USING (client_id = public.get_client_id(auth.uid()));

-- RLS Policies for mini_site_data table
CREATE POLICY "Anyone can view mini site data" ON public.mini_site_data
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all mini sites" ON public.mini_site_data
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients can update their own mini site" ON public.mini_site_data
  FOR UPDATE USING (client_id = public.get_client_id(auth.uid()));

-- RLS Policies for physical_orders table
CREATE POLICY "Admins can manage all orders" ON public.physical_orders
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients can view their own orders" ON public.physical_orders
  FOR SELECT USING (client_id = public.get_client_id(auth.uid()));

-- RLS Policies for blog_categories table
CREATE POLICY "Anyone can view blog categories" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog categories" ON public.blog_categories
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for blog_posts table
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for notifications table
CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients can view their own notifications" ON public.notifications
  FOR SELECT USING (client_id = public.get_client_id(auth.uid()));

-- RLS Policies for audit_logs table
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Create function to calculate monthly total for contracts
CREATE OR REPLACE FUNCTION public.calculate_monthly_total(p_client_id UUID)
RETURNS DECIMAL(10,2)
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(SUM(s.price), 0)
  FROM public.contracts c
  JOIN public.services s ON c.service_id = s.id
  WHERE c.client_id = p_client_id 
    AND c.status = 'active' 
    AND s.type = 'recurring';
$$;

-- Create function to update monthly totals
CREATE OR REPLACE FUNCTION public.update_monthly_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update monthly_total for affected client
  UPDATE public.contracts 
  SET monthly_total = public.calculate_monthly_total(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.client_id
      ELSE NEW.client_id
    END
  )
  WHERE client_id = CASE 
    WHEN TG_OP = 'DELETE' THEN OLD.client_id
    ELSE NEW.client_id
  END;
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

-- Create trigger to auto-update monthly totals
CREATE TRIGGER update_contracts_monthly_total
  AFTER INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_monthly_totals();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION public.log_audit_action(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE SQL
AS $$
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details);
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_info_updated_at
  BEFORE UPDATE ON public.clients_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mini_site_data_updated_at
  BEFORE UPDATE ON public.mini_site_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_physical_orders_updated_at
  BEFORE UPDATE ON public.physical_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('client-logos', 'client-logos', true),
  ('blog-images', 'blog-images', true);

-- Create storage policies for client logos
CREATE POLICY "Anyone can view client logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'client-logos');

CREATE POLICY "Authenticated users can upload client logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'client-logos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'client-logos' AND 
    auth.role() = 'authenticated'
  );

-- Create storage policies for blog images
CREATE POLICY "Anyone can view blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can manage blog images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'blog-images' AND 
    public.is_admin(auth.uid())
  );

-- Insert initial services
INSERT INTO public.services (name, category, description, type, price) VALUES
  ('Site Profissional', 'Websites', 'Website responsivo e otimizado para seu negócio', 'recurring', 97.90),
  ('Marketing Digital', 'Marketing', 'Gestão completa de redes sociais e campanhas', 'recurring', 97.90),
  ('Mini-site', 'Websites', 'Página personalizada para divulgação do seu negócio', 'recurring', 47.90),
  ('Consultoria', 'Consultoria', 'Consultoria especializada em transformação digital', 'recurring', 97.90),
  ('App Mobile', 'Aplicativos', 'Aplicativo nativo para iOS e Android', 'recurring', 197.90),
  ('Placa de Identificação', 'Produtos Físicos', 'Placa personalizada para seu estabelecimento', 'one_time', 89.90);

-- Insert initial blog categories
INSERT INTO public.blog_categories (name, description) VALUES
  ('Marketing Digital', 'Artigos sobre estratégias de marketing digital'),
  ('Desenvolvimento Web', 'Conteúdo sobre criação e desenvolvimento de sites'),
  ('Empreendedorismo', 'Dicas e insights para empreendedores'),
  ('Tecnologia', 'Novidades e tendências tecnológicas'),
  ('Cases de Sucesso', 'Histórias de clientes que alcançaram o sucesso');