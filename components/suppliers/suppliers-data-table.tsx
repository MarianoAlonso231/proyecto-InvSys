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
  MoreHorizontal, 
  Mail, 
  Phone 
} from "lucide-react";

export default function SuppliersDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from the API
  const suppliers = [
    {
      id: "1",
      name: "ABC Office Supplies",
      contactPerson: "John Smith",
      email: "john.smith@abcoffice.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business Ave, New York, NY 10001",
    },
    {
      id: "2",
      name: "Tech Solutions Inc.",
      contactPerson: "Sarah Johnson",
      email: "sarah@techsolutions.com",
      phone: "+1 (555) 987-6543",
      address: "456 Technology Blvd, San Francisco, CA 94107",
    },
    {
      id: "3",
      name: "Global Furniture Co.",
      contactPerson: "Michael Brown",
      email: "mbrown@globalfurniture.com",
      phone: "+1 (555) 456-7890",
      address: "789 Industrial Pkwy, Chicago, IL 60607",
    },
    {
      id: "4",
      name: "Stationery World",
      contactPerson: "Emily Davis",
      email: "emily@stationeryworld.com",
      phone: "+1 (555) 234-5678",
      address: "321 Office Lane, Austin, TX 78701",
    },
    {
      id: "5",
      name: "Electronics Wholesale",
      contactPerson: "David Wilson",
      email: "dwilson@electronics.com",
      phone: "+1 (555) 876-5432",
      address: "567 Circuit Road, Seattle, WA 98101",
    },
  ];

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Supplier Directory</CardTitle>
            <CardDescription>
              Manage your supplier contacts and relationships
            </CardDescription>
          </div>
          <Button className="shrink-0" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Sort
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Most Recent</DropdownMenuItem>
                <DropdownMenuItem>Oldest First</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No suppliers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div className="font-medium">{supplier.name}</div>
                    </TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {supplier.address}
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Purchases</DropdownMenuItem>
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