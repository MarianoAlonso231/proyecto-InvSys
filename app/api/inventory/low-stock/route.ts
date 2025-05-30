import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('get_low_stock_products');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener productos con bajo stock:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos con bajo stock' },
      { status: 500 }
    );
  }
} 