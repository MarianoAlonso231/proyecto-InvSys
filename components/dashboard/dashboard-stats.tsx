"use client";

import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  DollarSign 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardStats() {
  // Normally, this data would come from the database
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,548",
      change: "+12.5%",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      trend: "up",
    },
    {
      title: "Sales",
      value: "324",
      change: "+7.2%",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      trend: "up",
    },
    {
      title: "Products",
      value: "156",
      change: "+24",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      trend: "up",
    },
    {
      title: "Purchases",
      value: "54",
      change: "+8.4%",
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              {stat.change}
              {stat.trend === 'up' ? (
                <TrendingUp className="ml-1 h-3 w-3" />
              ) : (
                <TrendingUp className="ml-1 h-3 w-3 transform rotate-180" />
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}