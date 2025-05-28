import { createClient as supabaseCreateClient } from '@supabase/supabase-js'; // Renombrar para evitar conflicto
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Exportar la función original para poder crear clientes si es necesario
// Esto es lo que tu login-form.tsx está intentando importar
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing. Check your .env file.');
  }
  return supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Exportar la instancia pre-configurada para uso general
export const supabase = createClient();