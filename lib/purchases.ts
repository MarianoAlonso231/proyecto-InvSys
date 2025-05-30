import { supabase } from '@/lib/supabase/client'
import { Purchase, CreatePurchaseDTO, PurchaseItem, CreatePurchaseItemDTO } from '@/types/purchases'

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
    .order('created_at', { ascending: false })

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