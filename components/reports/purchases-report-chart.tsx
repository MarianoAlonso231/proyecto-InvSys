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

export default function PurchasesReportChart() {
  const { theme } = useTheme();
  
  // Mock data - in a real app, this would come from the API
  const data = [
    { month: "Jan", purchases: 3200, budget: 3500 },
    { month: "Feb", purchases: 3500, budget: 3500 },
    { month: "Mar", purchases: 4100, budget: 4000 },
    { month: "Apr", purchases: 3800, budget: 4000 },
    { month: "May", purchases: 4700, budget: 4500 },
    { month: "Jun", purchases: 5800, budget: 5000 },
    { month: "Jul", purchases: 6400, budget: 5500 },
    { month: "Aug", purchases: 6100, budget: 6000 },
    { month: "Sep", purchases: 7200, budget: 6500 },
    { month: "Oct", purchases: 7500, budget: 7000 },
    { month: "Nov", purchases: 7900, budget: 7500 },
    { month: "Dec", purchases: 8700, budget: 8000 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Analysis</CardTitle>
        <CardDescription>
          Monthly purchases vs budget for the current year
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
              name="Purchases" 
              dataKey="purchases" 
              fill="hsl(var(--chart-3))" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="Budget" 
              dataKey="budget" 
              fill="hsl(var(--chart-4))" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}