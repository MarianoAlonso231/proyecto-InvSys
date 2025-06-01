import { supabase } from '@/lib/supabase/client'
import { Sale, CreateSaleDTO, SaleItem, CreateSaleItemDTO } from '@/types/sales'

export type SortOption = 
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc'
  | 'reference-asc'
  | 'reference-desc'

export type FilterOption = {
  status: Sale['status'] | 'all'
  paymentMethod: Sale['payment_method'] | 'all'
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

export const sortSales = (sales: Sale[], sortBy: SortOption): Sale[] => {
  const sortedSales = [...sales]

  switch (sortBy) {
    case 'date-desc':
      return sortedSales.sort((a, b) => 
        new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
      )
    case 'date-asc':
      return sortedSales.sort((a, b) => 
        new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime()
      )
    case 'amount-desc':
      return sortedSales.sort((a, b) => b.total_amount - a.total_amount)
    case 'amount-asc':
      return sortedSales.sort((a, b) => a.total_amount - b.total_amount)
    case 'reference-asc':
      return sortedSales.sort((a, b) => 
        (a.reference_number || '').localeCompare(b.reference_number || '')
      )
    case 'reference-desc':
      return sortedSales.sort((a, b) => 
        (b.reference_number || '').localeCompare(a.reference_number || '')
      )
    default:
      return sortedSales
  }
}

export const filterSales = (
  sales: Sale[],
  searchQuery: string,
  filters: FilterOption
): Sale[] => {
  return sales.filter((sale) => {
    // Aplicar filtro de búsqueda
    const matchesSearch = 
      (sale.reference_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase())

    // Aplicar filtro de estado
    const matchesStatus = 
      filters.status === 'all' || sale.status === filters.status

    // Aplicar filtro de método de pago
    const matchesPaymentMethod = 
      filters.paymentMethod === 'all' || sale.payment_method === filters.paymentMethod

    // Aplicar filtro de rango de fechas
    const saleDate = new Date(sale.sale_date)
    const matchesDateRange = 
      (!filters.dateRange.from || saleDate >= filters.dateRange.from) &&
      (!filters.dateRange.to || saleDate <= filters.dateRange.to)

    return matchesSearch && 
           matchesStatus && 
           matchesPaymentMethod && 
           matchesDateRange
  })
}

export const getSales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }

  console.log('Ventas obtenidas:', data);
  return data as Sale[];
}

export async function getSaleById(id: string) {
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .select('*')
    .eq('id', id)
    .single()

  if (saleError) throw saleError

  const { data: items, error: itemsError } = await supabase
    .from('sale_items')
    .select(`
      *,
      products (
        id,
        name,
        sku
      )
    `)
    .eq('sale_id', id)

  if (itemsError) throw itemsError

  return {
    ...sale,
    items
  }
}

export async function createSale(sale: CreateSaleDTO, items: CreateSaleItemDTO[]) {
  
  // Iniciar una transacción insertando primero la venta
  const { data: newSale, error: saleError } = await supabase
    .from('sales')
    .insert(sale)
    .select()
    .single()

  if (saleError) throw saleError

  // Preparar los items de la venta con el ID de la venta creada
  const saleItems = items.map(item => ({
    ...item,
    sale_id: newSale.id
  }))

  // Insertar los items de la venta
  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems)

  if (itemsError) {
    // Si hay un error al insertar los items, eliminar la venta
    await supabase
      .from('sales')
      .delete()
      .eq('id', newSale.id)
    
    throw itemsError
  }

  return newSale
}

export async function updateSaleStatus(id: string, status: Sale['status']) {
  const { data, error } = await supabase
    .from('sales')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSale(id: string) {
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
} 