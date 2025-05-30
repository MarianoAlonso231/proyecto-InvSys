"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

export default function SalesChart({ className }: { className?: string }) {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const { data: salesData } = useQuery({
    queryKey: ['monthly-sales', currentYear],
    queryFn: async () => {
      const response = await fetch(`/api/reports/monthly-sales?year=${currentYear}`);
      if (!response.ok) throw new Error('Error al cargar datos de ventas');
      return response.json();
    }
  });

  const chartData = salesData?.map((item: any) => ({
    name: item.month,
    ventas: item.sales,
    objetivo: item.target
  })) || [];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ventas vs Objetivos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [formatCurrency(value)]}
              />
              <Line 
                type="monotone" 
                dataKey="ventas" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="objetivo" 
                stroke="#DC2626" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}