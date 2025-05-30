export type Purchase = {
  id: string;
  supplier_id: string;
  reference_number: string;
  purchase_date: Date;
  total_amount: number;
  status: 'pending' | 'received' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial' | 'refunded';
  notes?: string;
  created_at: Date;
  updated_at: Date;
  // Campos calculados/relacionados
  supplier?: {
    id: string;
    name: string;
  };
}

export type PurchaseItem = {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: Date;
  // Campos calculados/relacionados
  product?: {
    id: string;
    name: string;
    sku: string;
  };
}

export type CreatePurchaseDTO = Omit<Purchase, 'id' | 'created_at' | 'updated_at' | 'supplier'>;
export type CreatePurchaseItemDTO = Omit<PurchaseItem, 'id' | 'created_at' | 'product'>; 