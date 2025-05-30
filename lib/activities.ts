import { supabase } from '@/lib/supabase/client';

export type Activity = {
  id: string;
  type: 'purchase' | 'sale' | 'stock';
  description: string;
  date: string;
  amount: number | null;
};

type SupplierResponse = {
  supplier: {
    name: string;
  } | null;
};

export async function getRecentActivities(): Promise<Activity[]> {
  // Obtener las últimas 5 compras
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select(`
      id,
      total_amount,
      created_at,
      supplier:suppliers (
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (purchasesError) throw purchasesError;

  // Obtener las últimas 5 ventas
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select(`
      id,
      total_amount,
      created_at,
      customer_name
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (salesError) throw salesError;

  // Combinar y ordenar las actividades
  const activities: Activity[] = [
    ...(purchases?.map((purchase: any & SupplierResponse) => ({
      id: purchase.id,
      type: 'purchase' as const,
      description: `Nueva compra de ${purchase.supplier?.name || 'Proveedor'}`,
      date: new Date(purchase.created_at).toISOString(),
      amount: purchase.total_amount,
    })) || []),
    ...(sales?.map(sale => ({
      id: sale.id,
      type: 'sale' as const,
      description: `Nueva venta a ${sale.customer_name || 'Cliente'}`,
      date: new Date(sale.created_at).toISOString(),
      amount: sale.total_amount,
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 5);

  return activities;
} 