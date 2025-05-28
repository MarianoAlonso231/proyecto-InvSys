import { Metadata } from "next";
import ReportsOverview from "@/components/reports/reports-overview";

export const metadata: Metadata = {
  title: "Reports - Inventory Management System",
  description: "View and generate business reports",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      </div>
      <ReportsOverview />
    </div>
  );
}