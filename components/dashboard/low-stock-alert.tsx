"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface LowStockProduct {
  id: string;
  name: string;
  current_stock: number;
  min_stock_level: number;
  unit_price: number;
  total_value: number;
}

export default function LowStockAlert({ className }: { className?: string }) {
  const { data: lowStockData } = useQuery<LowStockProduct[]>({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/low-stock');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al cargar productos con bajo stock');
      }
      return response.json();
    }
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Alertas de Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {lowStockData?.map((product) => (
              <Alert key={product.id} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{product.name}</AlertTitle>
                <AlertDescription>
                  Stock actual: {product.current_stock} unidades
                  <br />
                  Nivel mínimo: {product.min_stock_level} unidades
                  <br />
                  Valor en inventario: {formatCurrency(product.total_value)}
                </AlertDescription>
              </Alert>
            ))}
            {(!lowStockData || lowStockData.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay productos con bajo stock
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}