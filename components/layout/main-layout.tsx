"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import Sidebar from "./sidebar"; // Import desde la misma carpeta layout

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  // Estado para manejar la sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Si es la página de login, solo renderiza el contenido sin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Layout normal con header y sidebar para todas las demás páginas
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar con props necesarias */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Contenedor principal que se ajusta según el estado de la sidebar */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-0">
        {/* Header con función para toggle de sidebar */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}