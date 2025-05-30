"use client";

import { useEffect, useState } from "react";
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
  LayoutList,
  Loader2
} from "lucide-react";
import { Activity, getRecentActivities } from "@/lib/activities";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error al cargar actividades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type: Activity['type']) => {
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

  const getIconColor = (type: Activity['type']) => {
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

  const formatAmount = (amount: number | null) => {
    if (amount === null) return null;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
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
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2">
            {activities.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No hay actividades recientes
              </p>
            ) : (
              activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <div className={`rounded-full p-2 ${getIconColor(activity.type)}`}>
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.date), { 
                        addSuffix: true,
                        locale: es 
                      })}
                    </p>
                  </div>
                  {activity.amount !== null && (
                    <div className="font-medium">
                      {formatAmount(activity.amount)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}