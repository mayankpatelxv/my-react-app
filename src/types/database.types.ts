export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          barcode: string | null
          category: string
          created_at: string | null
          description: string | null
          dimensions: string | null
          id: number
          location: string | null
          min_stock_level: number | null
          name: string
          notes: string | null
          price: number
          sku: string | null
          stock_level: number
          supplier: string | null
          unit: string
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          id?: number
          location?: string | null
          min_stock_level?: number | null
          name: string
          notes?: string | null
          price: number
          sku?: string | null
          stock_level?: number
          supplier?: string | null
          unit: string
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          id?: number
          location?: string | null
          min_stock_level?: number | null
          name?: string
          notes?: string | null
          price?: number
          sku?: string | null
          stock_level?: number
          supplier?: string | null
          unit?: string
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
      }
      sales: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_name: string
          discount_amount: number
          due_date: string | null
          id: number
          invoice_date: string
          invoice_number: string
          notes: string | null
          payment_terms: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_name: string
          discount_amount?: number
          due_date?: string | null
          id?: number
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          payment_terms?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string
          discount_amount?: number
          due_date?: string | null
          id?: number
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          payment_terms?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
      }
      parties: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          email: string
          id: string
          name: string
          notes: string | null
          party_type: string
          payment_terms: string | null
          phone: string | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email: string
          id?: string
          name: string
          notes?: string | null
          party_type: string
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          party_type?: string
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
      }
    }
  }
}