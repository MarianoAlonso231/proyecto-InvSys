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
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function SalesDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from the API
  const sales = [
    {
      id: "1",
      reference: "INV-2025-001",
      customer: "Acme Corporation",
      date: new Date("2025-06-01"),
      amount: 1250.99,
      status: "completed",
      paymentMethod: "credit_card",
    },
    {
      id: "2",
      reference: "INV-2025-002",
      customer: "TechStart LLC",
      date: new Date("2025-06-02"),
      amount: 785.50,
      status: "completed",
      paymentMethod: "bank_transfer",
    },
    {
      id: "3",
      reference: "INV-2025-003",
      customer: "Global Industries",
      date: new Date("2025-06-03"),
      amount: 2340.00,
      status: "pending",
      paymentMethod: "credit_card",
    },
    {
      id: "4",
      reference: "INV-2025-004",
      customer: "Smith & Co",
      date: new Date("2025-06-05"),
      amount: 450.75,
      status: "cancelled",
      paymentMethod: "cash",
    },
    {
      id: "5",
      reference: "INV-2025-005",
      customer: "Johnson Enterprises",
      date: new Date("2025-06-07"),
      amount: 1875.25,
      status: "completed",
      paymentMethod: "credit_card",
    },
    {
      id: "6",
      reference: "INV-2025-006",
      customer: "SoftDev Inc",
      date: new Date("2025-06-08"),
      amount: 3200.00,
      status: "completed",
      paymentMethod: "bank_transfer",
    },
  ];

  // Filter sales based on search query
  const filteredSales = sales.filter(
    (sale) =>
      sale.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
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

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "credit_card":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <CreditCard className="mr-1 h-3 w-3" />
            Credit Card
          </Badge>
        );
      case "bank_transfer":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            <CreditCard className="mr-1 h-3 w-3" />
            Bank Transfer
          </Badge>
        );
      case "cash":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CreditCard className="mr-1 h-3 w-3" />
            Cash
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
            <CardTitle>Sales Transactions</CardTitle>
            <CardDescription>
              Manage your sales and invoices
            </CardDescription>
          </div>
          <Button className="shrink-0" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sales..."
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
                <DropdownMenuItem>Payment Method</DropdownMenuItem>
                <DropdownMenuItem>Date Range</DropdownMenuItem>
                <DropdownMenuItem>Amount</DropdownMenuItem>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No sales found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="font-medium">{sale.reference}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {sale.customer}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(sale.date, "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {getStatusBadge(sale.status)}
                        {getPaymentMethodBadge(sale.paymentMethod)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${sale.amount.toFixed(2)}
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
                          <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
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