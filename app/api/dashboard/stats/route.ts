import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Obtener todas las estadísticas en paralelo
    const [
      { data: monthSales },
      { data: monthPurchases },
      { data: inventoryValue },
      { data: averageSales }
    ] = await Promise.all([
      supabase.rpc('get_current_month_sales'),
      supabase.rpc('get_current_month_purchases'),
      supabase.rpc('get_total_inventory_value'),
      supabase.rpc('get_average_daily_sales')
    ]);

    return NextResponse.json({
      sales: monthSales || 0,
      purchases: monthPurchases || 0,
      inventory_value: inventoryValue || 0,
      average_daily_sales: averageSales || 0
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
} 