"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface SalesChartProps {
  className?: string;
}

export default function SalesChart({ className }: SalesChartProps) {
  const { theme } = useTheme();
  
  // Mock data - in a real app, this would come from the API
  const data = [
    { date: "Jan", sales: 2500, purchases: 1800 },
    { date: "Feb", sales: 3500, purchases: 2800 },
    { date: "Mar", sales: 4200, purchases: 3200 },
    { date: "Apr", sales: 3800, purchases: 2900 },
    { date: "May", sales: 4900, purchases: 3700 },
    { date: "Jun", sales: 5700, purchases: 4500 },
    { date: "Jul", sales: 6200, purchases: 5100 },
  ];

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>Vista general de las compras y ventas</CardTitle>
        <CardDescription>
        Comparativa de tendencias de ventas vs compras en el tiempo
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              stroke={theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              stroke={theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
                borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                borderRadius: "6px",
                color: theme === "dark" ? "white" : "black"
              }}
              formatter={(value: number) => [`$${value}`, ""]}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stackId="1" 
              stroke="hsl(var(--chart-1))" 
              fill="hsl(var(--chart-1))" 
              fillOpacity={0.3}
            />
            <Area 
              type="monotone" 
              dataKey="purchases" 
              stackId="2" 
              stroke="hsl(var(--chart-2))" 
              fill="hsl(var(--chart-2))" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}