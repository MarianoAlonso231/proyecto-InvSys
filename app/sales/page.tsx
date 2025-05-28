import { Metadata } from "next";
import SalesDataTable from "@/components/sales/sales-data-table";

export const metadata: Metadata = {
  title: "Sales - Inventory Management System",
  description: "Manage your sales transactions",
};

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
      </div>
      <SalesDataTable />
    </div>
  );
}