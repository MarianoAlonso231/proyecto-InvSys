export type Sale = {
  id: string;
  customer_name: string;
  reference_number: string;
  sale_date: Date;
  total_amount: number;
  payment_method: 'cash' | 'credit_card' | 'bank_transfer';
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export type SaleItem = {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: Date;
}

export type CreateSaleDTO = Omit<Sale, 'id' | 'created_at' | 'updated_at'>;
export type CreateSaleItemDTO = Omit<SaleItem, 'id' | 'created_at'>; 