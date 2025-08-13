// src/api/apiClient.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(endpoint: string, method: HttpMethod = "GET", body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Erro ao acessar ${endpoint}`);
  }

  return data as T;
}

// ===== SERVIÇOS =====
export interface Service {
  id?: string | number;
  name: string;
  description?: string;
  category?: string;
  type?: "recurring" | "one_time";
  price?: number;
  is_active?: boolean;
}

export const servicesApi = {
  getAll: () => request<Service[]>("/api/admin/services"),
  create: (service: Service) => request<Service>("/api/admin/services", "POST", service),
  update: (id: string | number, service: Service) => request<Service>(`/api/admin/services/${id}`, "PUT", service),
  delete: (id: string | number) => request<void>(`/api/admin/services/${id}`, "DELETE"),
};

// ===== CLIENTES =====
export interface Client {
  id?: string | number;
  name: string;
  email?: string;
  phone?: string;
  // outros campos que precisar
}

export const clientsApi = {
  getAll: () => request<Client[]>("/api/admin/clients"),
  create: (client: Client) => request<Client>("/api/admin/clients", "POST", client),
  update: (id: string | number, client: Client) => request<Client>(`/api/admin/clients/${id}`, "PUT", client),
  delete: (id: string | number) => request<void>(`/api/admin/clients/${id}`, "DELETE"),
};
