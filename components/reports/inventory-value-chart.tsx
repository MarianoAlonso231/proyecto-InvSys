"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function InventoryValueChart() {
  const { theme } = useTheme();
  
  // Mock data - in a real app, this would come from the API
  const data = [
    { month: "Jan", value: 62000, items: 120 },
    { month: "Feb", value: 65500, items: 124 },
    { month: "Mar", value: 68000, items: 128 },
    { month: "Apr", value: 72500, items: 132 },
    { month: "May", value: 75000, items: 138 },
    { month: "Jun", value: 78500, items: 142 },
    { month: "Jul", value: 81000, items: 148 },
    { month: "Aug", value: 83500, items: 150 },
    { month: "Sep", value: 85000, items: 152 },
    { month: "Oct", value: 87000, items: 156 },
    { month: "Nov", value: 88500, items: 158 },
    { month: "Dec", value: 90000, items: 160 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Value Trend</CardTitle>
        <CardDescription>
          Monthly inventory value and product count
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              yAxisId="left"
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              stroke={theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              stroke={theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
                borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                borderRadius: "6px",
                color: theme === "dark" ? "white" : "black"
              }}
              formatter={(value: number, name: string) => {
                if (name === "Inventory Value") {
                  return [`$${value.toLocaleString()}`, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              name="Inventory Value" 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--chart-5))" 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              name="Product Count" 
              type="monotone" 
              dataKey="items" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}