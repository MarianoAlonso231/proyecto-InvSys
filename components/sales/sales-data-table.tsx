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
  Loader2,
  Check,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Sale } from "@/types/sales";
import { getSales, updateSaleStatus, deleteSale, filterSales, sortSales, type FilterOption, type SortOption } from "@/lib/sales";
import { useToast } from "@/components/ui/use-toast";
import CreateSaleDialog from "./create-sale-dialog";
import EditSaleDialog from "./edit-sale-dialog";
import DeleteSaleDialog from "./delete-sale-dialog";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

export default function SalesDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [filters, setFilters] = useState<FilterOption>({
    status: 'all',
    paymentMethod: 'all',
    dateRange: {
      from: null,
      to: null
    }
  });
  const { toast } = useToast();

  const loadSales = async () => {
    try {
      setLoading(true);
      console.log('Cargando ventas...');
      const data = await getSales();
      console.log('Ventas cargadas:', data);
      setSales(data || []);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive",
      });
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

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

  // Aplicar filtros y ordenamiento
  const filteredAndSortedSales = sortSales(
    filterSales(sales, searchQuery, filters),
    sortBy
  );

  console.log('Estado actual:', {
    loading,
    salesCount: sales.length,
    filteredCount: filteredAndSortedSales.length,
    searchQuery,
    filters,
    sortBy
  });

  const getStatusBadge = (status: Sale['status']) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completada
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelada
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodBadge = (method: Sale['payment_method']) => {
    switch (method) {
      case "credit_card":
        return (
          <Badge variant="success">
            <CreditCard className="mr-1 h-3 w-3" />
            Tarjeta de Crédito
          </Badge>
        );
      case "bank_transfer":
        return (
          <Badge variant="warning">
            <DollarSign className="mr-1 h-3 w-3" />
            Transferencia
          </Badge>
        );
      case "cash":
        return (
          <Badge variant="secondary">
            <DollarSign className="mr-1 h-3 w-3" />
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
                  {(filters.status !== 'all' || 
                    filters.paymentMethod !== 'all' || 
                    filters.dateRange.from || 
                    filters.dateRange.to) && (
                    <Badge variant="secondary" className="ml-2">
                      Activo
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="font-normal">Estado</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'all' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.status === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'completed' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.status === 'completed' ? 'opacity-100' : 'opacity-0'}`} />
                  Completada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'pending' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.status === 'pending' ? 'opacity-100' : 'opacity-0'}`} />
                  Pendiente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'cancelled' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.status === 'cancelled' ? 'opacity-100' : 'opacity-0'}`} />
                  Cancelada
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal">Método de Pago</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentMethod: 'all' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentMethod === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentMethod: 'credit_card' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentMethod === 'credit_card' ? 'opacity-100' : 'opacity-0'}`} />
                  Tarjeta de Crédito
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentMethod: 'bank_transfer' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentMethod === 'bank_transfer' ? 'opacity-100' : 'opacity-0'}`} />
                  Transferencia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentMethod: 'cash' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentMethod === 'cash' ? 'opacity-100' : 'opacity-0'}`} />
                  Efectivo
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal">Rango de Fechas</DropdownMenuLabel>
                <div className="p-2">
                  <DatePickerWithRange 
                    date={{
                      from: filters.dateRange.from || undefined,
                      to: filters.dateRange.to || undefined
                    }}
                    onSelect={(range: DateRange | undefined) => 
                      setFilters(f => ({ 
                        ...f, 
                        dateRange: {
                          from: range?.from || null,
                          to: range?.to || null
                        }
                      }))
                    }
                  />
                </div>
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
                <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'date-desc' ? 'opacity-100' : 'opacity-0'}`} />
                  Fecha (Más reciente)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'date-asc' ? 'opacity-100' : 'opacity-0'}`} />
                  Fecha (Más antigua)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('amount-desc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'amount-desc' ? 'opacity-100' : 'opacity-0'}`} />
                  Monto (Mayor a menor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('amount-asc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'amount-asc' ? 'opacity-100' : 'opacity-0'}`} />
                  Monto (Menor a mayor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('reference-asc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'reference-asc' ? 'opacity-100' : 'opacity-0'}`} />
                  Referencia (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('reference-desc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'reference-desc' ? 'opacity-100' : 'opacity-0'}`} />
                  Referencia (Z-A)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referencia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead className="text-right">Monto Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron ventas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.reference_number || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(sale.sale_date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{sale.customer_name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell>{getPaymentMethodBadge(sale.payment_method)}</TableCell>
                    <TableCell className="text-right">
                      ${sale.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
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