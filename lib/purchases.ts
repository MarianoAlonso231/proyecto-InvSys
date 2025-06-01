import { supabase } from '@/lib/supabase/client'
import { Purchase, CreatePurchaseDTO, PurchaseItem, CreatePurchaseItemDTO } from '@/types/purchases'

export type SortOption = 
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc'
  | 'reference-asc'
  | 'reference-desc'

export type FilterOption = {
  status: Purchase['status'] | 'all'
  paymentStatus: Purchase['payment_status'] | 'all'
  supplier: string | null
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

export const sortPurchases = (purchases: Purchase[], sortBy: SortOption): Purchase[] => {
  const sortedPurchases = [...purchases]

  switch (sortBy) {
    case 'date-desc':
      return sortedPurchases.sort((a, b) => 
        new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()
      )
    case 'date-asc':
      return sortedPurchases.sort((a, b) => 
        new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime()
      )
    case 'amount-desc':
      return sortedPurchases.sort((a, b) => b.total_amount - a.total_amount)
    case 'amount-asc':
      return sortedPurchases.sort((a, b) => a.total_amount - b.total_amount)
    case 'reference-asc':
      return sortedPurchases.sort((a, b) => 
        (a.reference_number || '').localeCompare(b.reference_number || '')
      )
    case 'reference-desc':
      return sortedPurchases.sort((a, b) => 
        (b.reference_number || '').localeCompare(a.reference_number || '')
      )
    default:
      return sortedPurchases
  }
}

export const filterPurchases = (
  purchases: Purchase[],
  searchQuery: string,
  filters: FilterOption
): Purchase[] => {
  return purchases.filter((purchase) => {
    // Aplicar filtro de búsqueda
    const matchesSearch = 
      (purchase.reference_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (purchase.supplier?.name || "").toLowerCase().includes(searchQuery.toLowerCase())

    // Aplicar filtro de estado
    const matchesStatus = 
      filters.status === 'all' || purchase.status === filters.status

    // Aplicar filtro de estado de pago
    const matchesPaymentStatus = 
      filters.paymentStatus === 'all' || purchase.payment_status === filters.paymentStatus

    // Aplicar filtro de proveedor
    const matchesSupplier = 
      !filters.supplier || purchase.supplier?.id === filters.supplier

    // Aplicar filtro de rango de fechas
    const purchaseDate = new Date(purchase.purchase_date)
    const matchesDateRange = 
      (!filters.dateRange.from || purchaseDate >= filters.dateRange.from) &&
      (!filters.dateRange.to || purchaseDate <= filters.dateRange.to)

    return matchesSearch && 
           matchesStatus && 
           matchesPaymentStatus && 
           matchesSupplier && 
           matchesDateRange
  })
}

export async function getPurchases() {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      supplier:suppliers (
        id,
        name
      )
    `)
    .order('purchase_date', { ascending: false })

  if (error) throw error
  return data as Purchase[]
}

export async function getPurchaseById(id: string) {
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select(`
      *,
      supplier:suppliers (
        id,
        name
      )
    `)
    .eq('id', id)
    .single()

  if (purchaseError) throw purchaseError

  const { data: items, error: itemsError } = await supabase
    .from('purchase_items')
    .select(`
      *,
      product:products (
        id,
        name,
        sku
      )
    `)
    .eq('purchase_id', id)

  if (itemsError) throw itemsError

  return {
    ...purchase,
    items
  }
}

export async function createPurchase(purchase: CreatePurchaseDTO, items: CreatePurchaseItemDTO[]) {
  // Iniciar una transacción insertando primero la compra
  const { data: newPurchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert(purchase)
    .select()
    .single()

  if (purchaseError) throw purchaseError

  // Preparar los items de la compra con el ID de la compra creada
  const purchaseItems = items.map(item => ({
    ...item,
    purchase_id: newPurchase.id
  }))

  // Insertar los items de la compra
  const { error: itemsError } = await supabase
    .from('purchase_items')
    .insert(purchaseItems)

  if (itemsError) {
    // Si hay un error al insertar los items, eliminar la compra
    await supabase
      .from('purchases')
      .delete()
      .eq('id', newPurchase.id)
    
    throw itemsError
  }

  return newPurchase
}

export async function updatePurchaseStatus(id: string, status: Purchase['status']) {
  const { error } = await supabase
    .from('purchases')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

export async function updatePurchasePaymentStatus(id: string, payment_status: Purchase['payment_status']) {
  const { error } = await supabase
    .from('purchases')
    .update({ payment_status })
    .eq('id', id)

  if (error) throw error
}

export async function deletePurchase(id: string) {
  const { error } = await supabase
    .from('purchases')
    .delete()
    .eq('id', id)

  if (error) throw error
} 