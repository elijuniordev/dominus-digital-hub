export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string
          featured_image_url: string | null
          id: string
          slug: string | null
          status: Database["public"]["Enums"]["blog_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          slug?: string | null
          status?: Database["public"]["Enums"]["blog_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          slug?: string | null
          status?: Database["public"]["Enums"]["blog_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_info: {
        Row: {
          activation_key: string | null
          business_name: string | null
          cpf_cnpj: string | null
          created_at: string
          full_name: string
          id: string
          mini_site_url: string | null
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activation_key?: string | null
          business_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          full_name: string
          id?: string
          mini_site_url?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activation_key?: string | null
          business_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          full_name?: string
          id?: string
          mini_site_url?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          billing_day: number | null
          client_id: string
          contract_date: string
          created_at: string
          id: string
          monthly_total: number | null
          next_billing_date: string | null
          payment_method: string | null
          service_id: string
          status: Database["public"]["Enums"]["contract_status"]
          updated_at: string
        }
        Insert: {
          billing_day?: number | null
          client_id: string
          contract_date?: string
          created_at?: string
          id?: string
          monthly_total?: number | null
          next_billing_date?: string | null
          payment_method?: string | null
          service_id: string
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
        }
        Update: {
          billing_day?: number | null
          client_id?: string
          contract_date?: string
          created_at?: string
          id?: string
          monthly_total?: number | null
          next_billing_date?: string | null
          payment_method?: string | null
          service_id?: string
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      mini_site_data: {
        Row: {
          biography: string | null
          business_title: string | null
          client_id: string
          colors: Json | null
          created_at: string
          id: string
          logo_url: string | null
          operating_hours: Json | null
          social_media_links: Json | null
          updated_at: string
        }
        Insert: {
          biography?: string | null
          business_title?: string | null
          client_id: string
          colors?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          operating_hours?: Json | null
          social_media_links?: Json | null
          updated_at?: string
        }
        Update: {
          biography?: string | null
          business_title?: string | null
          client_id?: string
          colors?: Json | null
          created_at?: string
          id?: string
          logo_url?: string | null
          operating_hours?: Json | null
          social_media_links?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mini_site_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients_info"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          client_id: string
          created_at: string
          id: string
          message: string
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          message: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          message?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_info"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_orders: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          order_status: Database["public"]["Enums"]["order_status"]
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          tracking_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "physical_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_info"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          type: Database["public"]["Enums"]["service_type"]
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price: number
          type: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_monthly_total: {
        Args: { p_client_id: string }
        Returns: number
      }
      get_client_id: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_audit_action: {
        Args: {
          p_user_id: string
          p_action: string
          p_entity_type: string
          p_entity_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      blog_status: "draft" | "published" | "archived"
      contract_status: "active" | "inactive" | "suspended" | "cancelled"
      notification_status: "pending" | "sent" | "failed"
      notification_type: "billing" | "service" | "system" | "promotion"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      service_type: "one_time" | "recurring"
      user_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blog_status: ["draft", "published", "archived"],
      contract_status: ["active", "inactive", "suspended", "cancelled"],
      notification_status: ["pending", "sent", "failed"],
      notification_type: ["billing", "service", "system", "promotion"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      service_type: ["one_time", "recurring"],
      user_role: ["admin", "client"],
    },
  },
} as const
