"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Receipt, 
  BarChart3, 
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      title: "Panel",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Productos",
      href: "/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Proveedores",
      href: "/suppliers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Compras",
      href: "/purchases",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Ventas",
      href: "/sales",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Informes",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">InvSys</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="px-3 py-4">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <span 
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href || pathname?.startsWith(`${item.href}/`) 
                        ? "bg-accent text-accent-foreground" 
                        : "transparent"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}