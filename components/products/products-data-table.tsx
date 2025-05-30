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
  AlertTriangle,
  Package,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import ProductCreateDialog from "./product-create-dialog";
import ProductEditDialog from "./product-edit-dialog";
import DeleteProductDialog from "./delete-product-dialog";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

export default function ProductsDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Database["public"]["Tables"]["products"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Iniciando fetchProducts...');
      
      // Verificar la sesión primero
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error de sesión:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        console.error('No hay sesión activa');
        throw new Error('No hay sesión activa');
      }
      
      console.log('Sesión válida, procediendo a cargar productos...');
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .returns<Database['public']['Tables']['products']['Row'][]>();

      if (error) {
        console.error('Error al cargar productos:', error);
        throw error;
      }
      
      console.log('Productos cargados:', data);
      
      if (data) {
        setProducts(data);
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      const errorMessage = error.message || "No se pudieron cargar los productos";
      toast({
        title: "Error al cargar productos",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Productos</CardTitle>
            <CardDescription>
              Gestiona tu catálogo de productos y niveles de stock
            </CardDescription>
          </div>
          <ProductCreateDialog onProductCreated={fetchProducts} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
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
                <DropdownMenuItem>Categoría</DropdownMenuItem>
                <DropdownMenuItem>Bajo Stock</DropdownMenuItem>
                <DropdownMenuItem>Sin Stock</DropdownMenuItem>
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
                <DropdownMenuItem>Nombre (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Nombre (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Precio (Menor a Mayor)</DropdownMenuItem>
                <DropdownMenuItem>Precio (Mayor a Menor)</DropdownMenuItem>
                <DropdownMenuItem>Stock (Menor a Mayor)</DropdownMenuItem>
                <DropdownMenuItem>Stock (Mayor a Menor)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron productos.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <div className="relative h-10 w-10 rounded-md overflow-hidden">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      ${product.unit_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="font-medium">{product.current_stock}</span>
                        {product.current_stock <= (product.min_stock_level || 0) && (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Bajo
                          </Badge>
                        )}
                      </div>
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
                          <DropdownMenuSeparator />
                          <div className="flex items-center justify-between px-2">
                            <ProductEditDialog product={product} onProductUpdated={fetchProducts} />
                            <DeleteProductDialog productId={product.id} onProductDeleted={fetchProducts} />
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