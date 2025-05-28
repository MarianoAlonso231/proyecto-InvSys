"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChevronDown, 
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  MoreHorizontal,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function PurchasesDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from the API
  const purchases = [
    {
      id: "1",
      reference: "PO-2025-001",
      supplier: "ABC Office Supplies",
      date: new Date("2025-06-01"),
      amount: 2540.75,
      status: "received",
      paymentStatus: "paid",
    },
    {
      id: "2",
      reference: "PO-2025-002",
      supplier: "Tech Solutions Inc.",
      date: new Date("2025-06-03"),
      amount: 3750.00,
      status: "pending",
      paymentStatus: "unpaid",
    },
    {
      id: "3",
      reference: "PO-2025-003",
      supplier: "Global Furniture Co.",
      date: new Date("2025-06-05"),
      amount: 1875.50,
      status: "received",
      paymentStatus: "paid",
    },
    {
      id: "4",
      reference: "PO-2025-004",
      supplier: "Stationery World",
      date: new Date("2025-06-08"),
      amount: 580.25,
      status: "cancelled",
      paymentStatus: "refunded",
    },
    {
      id: "5",
      reference: "PO-2025-005",
      supplier: "Electronics Wholesale",
      date: new Date("2025-06-10"),
      amount: 4920.00,
      status: "pending",
      paymentStatus: "partial",
    },
  ];

  // Filter purchases based on search query
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Received
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <DollarSign className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        );
      case "unpaid":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            <DollarSign className="mr-1 h-3 w-3" />
            Unpaid
          </Badge>
        );
      case "partial":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <DollarSign className="mr-1 h-3 w-3" />
            Partial
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            <DollarSign className="mr-1 h-3 w-3" />
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>
              Manage your supplier purchase orders
            </CardDescription>
          </div>
          <Button className="shrink-0" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Purchase
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Payment Status</DropdownMenuItem>
                <DropdownMenuItem>Date Range</DropdownMenuItem>
                <DropdownMenuItem>Supplier</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Sort
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Date (Newest First)</DropdownMenuItem>
                <DropdownMenuItem>Date (Oldest First)</DropdownMenuItem>
                <DropdownMenuItem>Amount (High to Low)</DropdownMenuItem>
                <DropdownMenuItem>Amount (Low to High)</DropdownMenuItem>
                <DropdownMenuItem>Reference (A-Z)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No purchases found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div className="font-medium">{purchase.reference}</div>
                    </TableCell>
                    <TableCell>{purchase.supplier}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(purchase.date, "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {getStatusBadge(purchase.status)}
                        {getPaymentStatusBadge(purchase.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${purchase.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}