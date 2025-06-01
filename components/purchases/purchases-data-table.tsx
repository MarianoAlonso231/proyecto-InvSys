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
  Loader2,
  Check,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getPurchases, filterPurchases, sortPurchases, type FilterOption, type SortOption } from "@/lib/purchases";
import { Purchase } from "@/types/purchases";
import PurchaseCreateDialog from "./purchase-create-dialog";
import PurchaseEditDialog from "./purchase-edit-dialog";
import PurchaseDeleteDialog from "./purchase-delete-dialog";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function PurchasesDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [filters, setFilters] = useState<FilterOption>({
    status: 'all',
    paymentStatus: 'all',
    supplier: null,
    dateRange: {
      from: null,
      to: null
    }
  });
  const { toast } = useToast();

  // Obtener proveedores únicos
  const suppliers = Array.from(
    new Set(purchases
      .map(p => p.supplier)
      .filter((supplier): supplier is NonNullable<typeof supplier> => supplier !== null)
    )
  );

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

  // Aplicar filtros y ordenamiento
  const filteredAndSortedPurchases = sortPurchases(
    filterPurchases(purchases, searchQuery, filters),
    sortBy
  );

  const getStatusBadge = (status: Purchase['status']) => {
    switch (status) {
      case "received":
        return (
          <Badge variant="success">
            <CheckCircle className="mr-1 h-3 w-3" />
            Recibido
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
          <Badge variant="success">
            <DollarSign className="mr-1 h-3 w-3" />
            Pagado
          </Badge>
        );
      case "unpaid":
        return (
          <Badge variant="destructive">
            <DollarSign className="mr-1 h-3 w-3" />
            No Pagado
          </Badge>
        );
      case "partial":
        return (
          <Badge variant="warning">
            <DollarSign className="mr-1 h-3 w-3" />
            Parcial
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="secondary">
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
                  {(filters.status !== 'all' || 
                    filters.paymentStatus !== 'all' || 
                    filters.supplier || 
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
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'received' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.status === 'received' ? 'opacity-100' : 'opacity-0'}`} />
                  Recibido
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'pending' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.status === 'pending' ? 'opacity-100' : 'opacity-0'}`} />
                  Pendiente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'cancelled' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.status === 'cancelled' ? 'opacity-100' : 'opacity-0'}`} />
                  Cancelado
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal">Estado de Pago</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentStatus: 'all' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentStatus === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentStatus: 'paid' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentStatus === 'paid' ? 'opacity-100' : 'opacity-0'}`} />
                  Pagado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentStatus: 'unpaid' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentStatus === 'unpaid' ? 'opacity-100' : 'opacity-0'}`} />
                  No Pagado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentStatus: 'partial' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentStatus === 'partial' ? 'opacity-100' : 'opacity-0'}`} />
                  Parcial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, paymentStatus: 'refunded' }))}>
                  <Check className={`mr-2 h-4 w-4 ${filters.paymentStatus === 'refunded' ? 'opacity-100' : 'opacity-0'}`} />
                  Reembolsado
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal">Proveedor</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, supplier: null }))}>
                  <Check className={`mr-2 h-4 w-4 ${!filters.supplier ? 'opacity-100' : 'opacity-0'}`} />
                  Todos
                </DropdownMenuItem>
                {suppliers.map((supplier) => (
                  <DropdownMenuItem 
                    key={supplier.id} 
                    onClick={() => setFilters(f => ({ ...f, supplier: supplier.id }))}
                  >
                    <Check className={`mr-2 h-4 w-4 ${filters.supplier === supplier.id ? 'opacity-100' : 'opacity-0'}`} />
                    {supplier.name}
                  </DropdownMenuItem>
                ))}

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
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Estado de Pago</TableHead>
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
              ) : filteredAndSortedPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron compras.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.reference_number || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(purchase.purchase_date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{purchase.supplier?.name ?? "-"}</TableCell>
                    <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(purchase.payment_status)}</TableCell>
                    <TableCell className="text-right">
                      ${purchase.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <PurchaseEditDialog 
                            purchase={purchase}
                            onPurchaseUpdated={fetchPurchases}
                          />
                          <PurchaseDeleteDialog
                            purchase={purchase}
                            onPurchaseDeleted={fetchPurchases}
                          />
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