export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          sku: string | null;
          category: string | null;
          unit_price: number;
          current_stock: number;
          min_stock_level: number;
          created_at: string;
          updated_at: string;
          image_url: string | null; // <-- Agrega esta línea
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          sku?: string | null;
          category?: string | null;
          unit_price: number;
          current_stock?: number;
          min_stock_level?: number;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null; // <-- Agrega esta línea
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          sku?: string | null;
          category?: string | null;
          unit_price?: number;
          current_stock?: number;
          min_stock_level?: number;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null; // <-- Agrega esta línea
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_person: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          supplier_id: string | null;
          reference_number: string | null;
          purchase_date: string;
          total_amount: number;
          status: string;
          payment_status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id?: string | null;
          reference_number?: string | null;
          purchase_date?: string;
          total_amount?: number;
          status?: string;
          payment_status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string | null;
          reference_number?: string | null;
          purchase_date?: string;
          total_amount?: number;
          status?: string;
          payment_status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchase_items: {
        Row: {
          id: string;
          purchase_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          purchase_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          purchase_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          customer_name: string | null;
          reference_number: string | null;
          sale_date: string;
          total_amount: number;
          payment_method: string;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          reference_number?: string | null;
          sale_date?: string;
          total_amount?: number;
          payment_method?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string | null;
          reference_number?: string | null;
          sale_date?: string;
          total_amount?: number;
          payment_method?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
    };
  };
}