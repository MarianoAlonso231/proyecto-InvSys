export type SalesReport = {
  period: string;
  total_sales: number;
  total_items: number;
  average_sale: number;
  top_products: {
    product_id: string;
    product_name: string;
    quantity: number;
    total_amount: number;
  }[];
}

export type PurchasesReport = {
  period: string;
  total_purchases: number;
  total_items: number;
  average_purchase: number;
  top_suppliers: {
    supplier_id: string;
    supplier_name: string;
    total_purchases: number;
    total_amount: number;
  }[];
}

export type InventoryReport = {
  total_products: number;
  total_value: number;
  low_stock_products: {
    product_id: string;
    product_name: string;
    current_stock: number;
    min_stock_level: number;
    unit_price: number;
    total_value: number;
  }[];
  out_of_stock_products: {
    product_id: string;
    product_name: string;
    min_stock_level: number;
    last_purchase_date: string | null;
  }[];
}

export type DateRange = {
  start_date: string;
  end_date: string;
}; 