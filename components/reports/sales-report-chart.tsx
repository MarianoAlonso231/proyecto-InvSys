"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SalesReportChart() {
  const { theme } = useTheme();
  
  // Mock data - in a real app, this would come from the API
  const data = [
    { month: "Jan", sales: 4000, target: 4500 },
    { month: "Feb", sales: 4500, target: 4500 },
    { month: "Mar", sales: 5200, target: 5000 },
    { month: "Apr", sales: 4800, target: 5000 },
    { month: "May", sales: 6000, target: 5500 },
    { month: "Jun", sales: 7500, target: 6000 },
    { month: "Jul", sales: 8200, target: 6500 },
    { month: "Aug", sales: 7800, target: 7000 },
    { month: "Sep", sales: 9000, target: 7500 },
    { month: "Oct", sales: 9800, target: 8000 },
    { month: "Nov", sales: 10200, target: 8500 },
    { month: "Dec", sales: 11500, target: 9000 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <CardDescription>
          Monthly sales vs targets for the current year
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />
            <XAxis 
              dataKey="month" 
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
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
                borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                borderRadius: "6px",
                color: theme === "dark" ? "white" : "black"
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend />
            <Bar 
              name="Sales" 
              dataKey="sales" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="Target" 
              dataKey="target" 
              fill="hsl(var(--chart-2))" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}