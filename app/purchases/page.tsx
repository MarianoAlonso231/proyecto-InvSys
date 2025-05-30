import { Metadata } from "next";
import PurchasesDataTable from "@/components/purchases/purchases-data-table";

export const metadata: Metadata = {
  title: "Compras - Sistema de Inventario",
  description: "Gestiona tus órdenes de compra",
};

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Compras</h2>
      </div>
      <PurchasesDataTable />
    </div>
  );
}