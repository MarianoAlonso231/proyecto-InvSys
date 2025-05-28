import { Metadata } from "next";
import SalesDataTable from "@/components/sales/sales-data-table";

export const metadata: Metadata = {
  title: "Ventas - Sistema de Gestión de Inventario",
  description: "Gestiona tus transacciones de ventas",
};

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ventas</h2>
      </div>
      <SalesDataTable />
    </div>
  );
}