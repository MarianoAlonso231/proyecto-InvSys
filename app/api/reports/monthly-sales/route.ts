import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  try {
    const { data, error } = await supabase.rpc('get_monthly_sales', {
      target_year: parseInt(year)
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener ventas mensuales:', error);
    return NextResponse.json(
      { error: 'Error al obtener ventas mensuales' },
      { status: 500 }
    );
  }
} 