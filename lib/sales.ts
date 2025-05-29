import { supabase } from '@/lib/supabase/client'
import { Sale, CreateSaleDTO, SaleItem, CreateSaleItemDTO } from '@/types/sales'

export async function getSales() {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Sale[]
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