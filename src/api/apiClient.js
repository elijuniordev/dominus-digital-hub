// src/api/apiClient.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
async function request(endpoint, method = "GET", body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || `Erro ao acessar ${endpoint}`);
    }
    return data;
}
export const servicesApi = {
    getAll: () => request("/api/admin/services"),
    create: (service) => request("/api/admin/services", "POST", service),
    update: (id, service) => request(`/api/admin/services/${id}`, "PUT", service),
    delete: (id) => request(`/api/admin/services/${id}`, "DELETE"),
};
export const clientsApi = {
    getAll: () => request("/api/admin/clients"),
    create: (client) => request("/api/admin/clients", "POST", client),
    update: (id, client) => request(`/api/admin/clients/${id}`, "PUT", client),
    delete: (id) => request(`/api/admin/clients/${id}`, "DELETE"),
};
//# sourceMappingURL=apiClient.js.map