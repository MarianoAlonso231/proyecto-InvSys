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
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  User,
  Loader2,
  Check,
  Trash,
  Edit
} from "lucide-react";
import { format } from "date-fns";
import { Supplier } from "@/types/suppliers";
import { 
  getSuppliers, 
  deleteSupplier, 
  filterSuppliers, 
  sortSuppliers, 
  type SortOption 
} from "@/lib/suppliers";
import { useToast } from "@/components/ui/use-toast";
import CreateSupplierDialog from "./create-supplier-dialog";
import EditSupplierDialog from "./edit-supplier-dialog";
import DeleteSupplierDialog from "./delete-supplier-dialog";

export default function SuppliersDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const { toast } = useToast();

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      });
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      await loadSuppliers();
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor",
        variant: "destructive",
      });
    }
  };

  // Aplicar filtros y ordenamiento
  const filteredAndSortedSuppliers = sortSuppliers(
    filterSuppliers(suppliers, { searchQuery }),
    sortBy
  );

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
            <CardTitle>Proveedores</CardTitle>
            <CardDescription>
              Gestiona tus proveedores y sus datos de contacto
            </CardDescription>
          </div>
          <CreateSupplierDialog onSupplierCreated={loadSuppliers} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proveedores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                Ordenar
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('name-asc')}>
                <Check className={`mr-2 h-4 w-4 ${sortBy === 'name-asc' ? 'opacity-100' : 'opacity-0'}`} />
                Nombre (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name-desc')}>
                <Check className={`mr-2 h-4 w-4 ${sortBy === 'name-desc' ? 'opacity-100' : 'opacity-0'}`} />
                Nombre (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
                <Check className={`mr-2 h-4 w-4 ${sortBy === 'date-desc' ? 'opacity-100' : 'opacity-0'}`} />
                Más recientes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
                <Check className={`mr-2 h-4 w-4 ${sortBy === 'date-asc' ? 'opacity-100' : 'opacity-0'}`} />
                Más antiguos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Fecha de Registro</TableHead>
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
              ) : filteredAndSortedSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron proveedores.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {supplier.contact_person}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        {supplier.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        {supplier.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {supplier.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(supplier.created_at), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <EditSupplierDialog
                            supplier={supplier}
                            onSupplierUpdated={loadSuppliers}
                          />
                          <DeleteSupplierDialog
                            supplier={supplier}
                            onSupplierDeleted={loadSuppliers}
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