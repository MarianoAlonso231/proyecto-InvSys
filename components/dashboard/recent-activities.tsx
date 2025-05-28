"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ShoppingCart, 
  Receipt, 
  Package, 
  LayoutList 
} from "lucide-react";

export default function RecentActivities() {
  // Mock data - in a real app, this would come from the API
  const activities = [
    {
      id: 1,
      type: "purchase",
      description: "New purchase from Supplier XYZ",
      date: "2 hours ago",
      amount: "$1,240.00",
    },
    {
      id: 2,
      type: "sale",
      description: "New sale to Customer ABC",
      date: "5 hours ago",
      amount: "$580.00",
    },
    {
      id: 3,
      type: "stock",
      description: "Stock updated for 3 products",
      date: "Yesterday",
      amount: null,
    },
    {
      id: 4,
      type: "purchase",
      description: "New purchase from Supplier DEF",
      date: "Yesterday",
      amount: "$3,200.00",
    },
    {
      id: 5,
      type: "sale",
      description: "New sale to Customer GHI",
      date: "2 days ago",
      amount: "$950.00",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="h-4 w-4" />;
      case "sale":
        return <Receipt className="h-4 w-4" />;
      case "stock":
        return <Package className="h-4 w-4" />;
      default:
        return <LayoutList className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
      case "sale":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
      case "stock":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividades recientes</CardTitle>
        <CardDescription>
          Últimas transacciones y movimientos de stock
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-2">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
            >
              <div className={`rounded-full p-2 ${getIconColor(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
              {activity.amount && (
                <div className="font-medium">
                  {activity.amount}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}