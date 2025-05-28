import { Metadata } from "next";
import SuppliersDataTable from "@/components/suppliers/suppliers-data-table";

export const metadata: Metadata = {
  title: "Suppliers - Inventory Management System",
  description: "Manage your suppliers",
};

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
      </div>
      <SuppliersDataTable />
    </div>
  );
}