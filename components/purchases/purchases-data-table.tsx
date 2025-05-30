"use client";

import { useEffect, useState } from "react";
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
  Search, 
  SlidersHorizontal, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getPurchases } from "@/lib/purchases";
import { Purchase } from "@/types/purchases";
import PurchaseCreateDialog from "./purchase-create-dialog";
import PurchaseEditDialog from "./purchase-edit-dialog";
import PurchaseDeleteDialog from "./purchase-delete-dialog";

export default function PurchasesDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await getPurchases();
      setPurchases(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las compras",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Purchase['status']) => {
    switch (status) {
      case "received":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Recibido
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: Purchase['payment_status']) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <DollarSign className="mr-1 h-3 w-3" />
            Pagado
          </Badge>
        );
      case "unpaid":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            <DollarSign className="mr-1 h-3 w-3" />
            No Pagado
          </Badge>
        );
      case "partial":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <DollarSign className="mr-1 h-3 w-3" />
            Parcial
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            <DollarSign className="mr-1 h-3 w-3" />
            Reembolsado
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
            <CardTitle>Órdenes de Compra</CardTitle>
            <CardDescription>
              Gestiona tus órdenes de compra a proveedores
            </CardDescription>
          </div>
          <PurchaseCreateDialog onPurchaseCreated={fetchPurchases} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar compras..."
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
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Estado</DropdownMenuItem>
                <DropdownMenuItem>Estado de Pago</DropdownMenuItem>
                <DropdownMenuItem>Rango de Fechas</DropdownMenuItem>
                <DropdownMenuItem>Proveedor</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Ordenar
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Fecha (Más reciente)</DropdownMenuItem>
                <DropdownMenuItem>Fecha (Más antigua)</DropdownMenuItem>
                <DropdownMenuItem>Monto (Mayor a menor)</DropdownMenuItem>
                <DropdownMenuItem>Monto (Menor a mayor)</DropdownMenuItem>
                <DropdownMenuItem>Referencia (A-Z)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referencia</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : filteredPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron compras.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div className="font-medium">{purchase.reference_number}</div>
                    </TableCell>
                    <TableCell>{purchase.supplier?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(new Date(purchase.purchase_date), "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {getStatusBadge(purchase.status)}
                        {getPaymentStatusBadge(purchase.payment_status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${purchase.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <PurchaseEditDialog
                          purchase={purchase}
                          onPurchaseUpdated={fetchPurchases}
                        />
                        <PurchaseDeleteDialog
                          purchase={purchase}
                          onPurchaseDeleted={fetchPurchases}
                        />
                      </div>
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