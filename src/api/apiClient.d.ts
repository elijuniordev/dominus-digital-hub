export interface Service {
    id?: string | number;
    name: string;
    description?: string;
    category?: string;
    type?: "recurring" | "one_time";
    price?: number;
    is_active?: boolean;
}
export declare const servicesApi: {
    getAll: () => Promise<Service[]>;
    create: (service: Service) => Promise<Service>;
    update: (id: string | number, service: Service) => Promise<Service>;
    delete: (id: string | number) => Promise<void>;
};
export interface Client {
    id?: string | number;
    name: string;
    email?: string;
    phone?: string;
}
export declare const clientsApi: {
    getAll: () => Promise<Client[]>;
    create: (client: Client) => Promise<Client>;
    update: (id: string | number, client: Client) => Promise<Client>;
    delete: (id: string | number) => Promise<void>;
};
