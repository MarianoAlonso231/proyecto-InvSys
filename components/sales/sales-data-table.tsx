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
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  MoreHorizontal,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Sale } from "@/types/sales";
import { getSales, updateSaleStatus, deleteSale } from "@/lib/sales";
import { useToast } from "@/components/ui/use-toast";
import CreateSaleDialog from "./create-sale-dialog";
import EditSaleDialog from "./edit-sale-dialog";
import DeleteSaleDialog from "./delete-sale-dialog";

export default function SalesDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Sale['status']) => {
    try {
      await updateSaleStatus(id, status);
      await loadSales();
      toast({
        title: "Éxito",
        description: "Estado de la venta actualizado",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la venta",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      return;
    }

    try {
      await deleteSale(id);
      await loadSales();
      toast({
        title: "Éxito",
        description: "Venta eliminada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la venta",
        variant: "destructive",
      });
    }
  };

  // Filter sales based on search query
  const filteredSales = sales.filter(
    (sale) =>
      sale.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completada
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
            Cancelada
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
            Tarjeta de Crédito
          </Badge>
        );
      case "bank_transfer":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            <CreditCard className="mr-1 h-3 w-3" />
            Transferencia
          </Badge>
        );
      case "cash":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CreditCard className="mr-1 h-3 w-3" />
            Efectivo
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Ventas</CardTitle>
            <CardDescription>
              Administra tus ventas y facturas
            </CardDescription>
          </div>
          <CreateSaleDialog onSaleCreated={loadSales} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ventas..."
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
                <DropdownMenuItem>Método de Pago</DropdownMenuItem>
                <DropdownMenuItem>Rango de Fechas</DropdownMenuItem>
                <DropdownMenuItem>Monto</DropdownMenuItem>
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
                <DropdownMenuItem>Fecha (Más Reciente)</DropdownMenuItem>
                <DropdownMenuItem>Fecha (Más Antigua)</DropdownMenuItem>
                <DropdownMenuItem>Monto (Mayor a Menor)</DropdownMenuItem>
                <DropdownMenuItem>Monto (Menor a Mayor)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referencia</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron ventas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="font-medium">{sale.reference_number}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {sale.customer_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(new Date(sale.sale_date), "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {getStatusBadge(sale.status)}
                        {getPaymentMethodBadge(sale.payment_method)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${sale.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                          <DropdownMenuItem>Imprimir Factura</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(sale.id, 'completed')}
                          >
                            Marcar como Completada
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(sale.id, 'pending')}
                          >
                            Marcar como Pendiente
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(sale.id, 'cancelled')}
                          >
                            Marcar como Cancelada
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="flex items-center justify-between px-2">
                            <EditSaleDialog sale={sale} onSaleUpdated={loadSales} />
                            <DeleteSaleDialog saleId={sale.id} onSaleDeleted={loadSales} />
                          </div>
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