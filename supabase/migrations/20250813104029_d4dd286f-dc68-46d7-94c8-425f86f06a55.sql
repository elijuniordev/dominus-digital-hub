-- Fix function search path security warnings by setting search_path

-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

-- Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Update get_client_id function
CREATE OR REPLACE FUNCTION public.get_client_id(user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.clients_info WHERE user_id = user_id;
$$;

-- Update calculate_monthly_total function
CREATE OR REPLACE FUNCTION public.calculate_monthly_total(p_client_id UUID)
RETURNS DECIMAL(10,2)
LANGUAGE SQL
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(SUM(s.price), 0)
  FROM public.contracts c
  JOIN public.services s ON c.service_id = s.id
  WHERE c.client_id = p_client_id 
    AND c.status = 'active' 
    AND s.type = 'recurring';
$$;

-- Update update_monthly_totals function
CREATE OR REPLACE FUNCTION public.update_monthly_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
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

-- Update log_audit_action function
CREATE OR REPLACE FUNCTION public.log_audit_action(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE SQL
SET search_path = public
AS $$
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details);
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;