"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShoppingCart } from "lucide-react";

interface LowStockAlertProps {
  className?: string;
}

export default function LowStockAlert({ className }: LowStockAlertProps) {
  // Mock data - in a real app, this would come from the API
  const lowStockItems = [
    { id: 1, name: "Office Chair", sku: "OC-001", current: 2, minimum: 5 },
    { id: 2, name: "Desk Lamp", sku: "DL-003", current: 3, minimum: 10 },
    { id: 3, name: "Wireless Mouse", sku: "WM-012", current: 4, minimum: 15 },
    { id: 4, name: "Keyboard", sku: "KB-008", current: 1, minimum: 8 },
  ];

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Alerta stock bajo
          </CardTitle>
          <CardDescription>
            Productos que necesitan reestockear
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Ver todo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3">
              <div className="space-y-1">
                <p className="font-medium">{item.name}</p>
                <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-destructive">{item.current} left</span>
                  <span className="text-xs text-muted-foreground">Min: {item.minimum}</span>
                </div>
                <Button size="icon" variant="ghost">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}