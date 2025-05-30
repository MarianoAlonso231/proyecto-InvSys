import { Metadata } from "next";
import SalesReportChart from "@/components/reports/sales-report-chart";
import PurchasesReportChart from "@/components/reports/purchases-report-chart";
import InventoryReportChart from "@/components/reports/inventory-report-chart";

export const metadata: Metadata = {
  title: "Informes - Sistema de Inventario",
  description: "Visualiza los informes y estadísticas del sistema",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Informes</h2>
      </div>
      <div className="grid gap-6">
        <SalesReportChart />
        <PurchasesReportChart />
        <InventoryReportChart />
      </div>
    </div>
  );
}