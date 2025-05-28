import { Metadata } from "next";
import ProductsDataTable from "@/components/products/products-data-table";

export const metadata: Metadata = {
  title: "Products - Inventory Management System",
  description: "Manage your product inventory",
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      </div>
      <ProductsDataTable />
    </div>
  );
}