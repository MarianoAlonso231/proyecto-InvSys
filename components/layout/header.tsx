"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Importar useRouter
import { 
  Menu, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  LogOut // Importar el ícono de LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator // Importar Separator si quieres separar visualmente
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase/client"; // Importar la instancia de Supabase
import type { User as SupabaseUser } from '@supabase/supabase-js'; // Importar el tipo User

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter(); // Hook para la redirección
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
      }
    };
    fetchUser();

    // Escuchar cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      // Accede a .subscription antes de llamar a unsubscribe
      authListener?.subscription?.unsubscribe(); 
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // La redirección se manejará con el onAuthStateChange o puedes forzarla aquí también:
    // router.push('/login');
  };

  const getPageTitle = () => {
    if (!pathname) return "Panel";
    
    const titles: { [key: string]: string } = {
      dashboard: "Panel",
      products: "Productos",
      suppliers: "Proveedores",
      purchases: "Compras",
      sales: "Ventas",
      reports: "Informes",
      settings: "Configuración"
    };
    
    const path = pathname.split("/")[1];
    return titles[path] || "Panel";
  };

  if (!mounted) return null; // Evita renderizado en servidor si hay hooks de cliente

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Alternar menú</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>

        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-auto flex items-center justify-between space-x-2 px-2">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium truncate max-w-[100px] md:max-w-[150px]">
                  {currentUser.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Se eliminan las opciones de Perfil, Configuración y el Separador */}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}