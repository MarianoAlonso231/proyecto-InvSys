import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { UserRole } from '@/types/auth';

export const useRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          // Mapa de correos a roles
          const roleMap: Record<string, UserRole> = {
            'admin@gmail.com': 'admin',
            'ventas1@gmail.com': 'ventas',
            'inventario@gmail.com': 'inventario'
          };
          
          setRole(roleMap[session.user.email] || null);
        }
      } catch (error) {
        console.error('Error al obtener el rol:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const email = session?.user?.email;
        if (email) {
          const roleMap: Record<string, UserRole> = {
            'admin@gmail.com': 'admin',
            'ventas1@gmail.com': 'ventas',
            'inventario@gmail.com': 'inventario'
          };
          setRole(roleMap[email] || null);
        }
      } else if (event === 'SIGNED_OUT') {
        setRole(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { role, loading };
}; 