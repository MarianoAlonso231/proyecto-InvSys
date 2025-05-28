import DashboardStats from '@/components/dashboard/dashboard-stats';
import LowStockAlert from '@/components/dashboard/low-stock-alert';
import RecentActivities from '@/components/dashboard/recent-activities';
import SalesChart from '@/components/dashboard/sales-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="ml-auto">
          <Tabs defaultValue="daily" className="w-[250px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Diario</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SalesChart className="md:col-span-2 lg:col-span-4" />
        <LowStockAlert className="md:col-span-2 lg:col-span-3" />
      </div>

      <RecentActivities />
    </div>
  );
}