import { Metadata } from "next";
import SuppliersDataTable from "@/components/suppliers/suppliers-data-table";

export const metadata: Metadata = {
  title: "Proveedores - Sistema de Inventario",
  description: "Gestiona tus proveedores",
};

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
      </div>
      <SuppliersDataTable />
    </div>
  );
}