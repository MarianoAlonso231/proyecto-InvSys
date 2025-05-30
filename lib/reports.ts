import { supabase } from '@/lib/supabase/client'
import { SalesReport, PurchasesReport, InventoryReport, DateRange } from '@/types/reports'

export async function getSalesReport({ start_date, end_date }: DateRange): Promise<SalesReport> {
  // Obtener resumen de ventas
  const { data: salesSummary, error: salesError } = await supabase
    .rpc('get_sales_summary', { start_date, end_date })

  if (salesError) throw salesError

  // Obtener productos más vendidos
  const { data: topProducts, error: productsError } = await supabase
    .rpc('get_top_selling_products', { start_date, end_date, limit: 5 })

  if (productsError) throw productsError

  return {
    period: `${start_date} - ${end_date}`,
    ...salesSummary,
    top_products: topProducts
  }
}

export async function getPurchasesReport({ start_date, end_date }: DateRange): Promise<PurchasesReport> {
  // Obtener resumen de compras
  const { data: purchasesSummary, error: purchasesError } = await supabase
    .rpc('get_purchases_summary', { start_date, end_date })

  if (purchasesError) throw purchasesError

  // Obtener proveedores principales
  const { data: topSuppliers, error: suppliersError } = await supabase
    .rpc('get_top_suppliers', { start_date, end_date, limit: 5 })

  if (suppliersError) throw suppliersError

  return {
    period: `${start_date} - ${end_date}`,
    ...purchasesSummary,
    top_suppliers: topSuppliers
  }
}

export async function getInventoryReport(): Promise<InventoryReport> {
  // Obtener resumen de inventario
  const { data: inventorySummary, error: inventoryError } = await supabase
    .rpc('get_inventory_summary')

  if (inventoryError) throw inventoryError

  // Obtener productos con bajo stock
  const { data: lowStockProducts, error: lowStockError } = await supabase
    .rpc('get_low_stock_products')

  if (lowStockError) throw lowStockError

  // Obtener productos sin stock
  const { data: outOfStockProducts, error: outOfStockError } = await supabase
    .rpc('get_out_of_stock_products')

  if (outOfStockError) throw outOfStockError

  return {
    ...inventorySummary,
    low_stock_products: lowStockProducts,
    out_of_stock_products: outOfStockProducts
  }
}

// Función auxiliar para obtener las ventas por mes para el gráfico
export async function getMonthlySales(year: number) {
  const { data, error } = await supabase
    .rpc('get_monthly_sales', { target_year: year })

  if (error) throw error
  return data
}

// Función auxiliar para obtener las compras por mes para el gráfico
export async function getMonthlyPurchases(year: number) {
  const { data, error } = await supabase
    .rpc('get_monthly_purchases', { target_year: year })

  if (error) throw error
  return data
}

// Función auxiliar para obtener el valor del inventario por mes
export async function getMonthlyInventoryValue(year: number) {
  const { data, error } = await supabase
    .rpc('get_monthly_inventory_value', { target_year: year })

  if (error) throw error
  return data
} 