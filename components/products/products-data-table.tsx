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
  Image as ImageIcon,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import ProductCreateDialog from "./product-create-dialog";
import ProductEditDialog from "./product-edit-dialog";
import DeleteProductDialog from "./delete-product-dialog";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { filterProducts, sortProducts, type FilterOption, type SortOption } from "@/lib/products";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductsDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const { toast } = useToast();

  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Iniciando fetchProducts...');
      
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
        .returns<Product[]>();

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

  // Aplicar filtros y ordenamiento
  const filteredAndSortedProducts = sortProducts(
    filterProducts(products, searchQuery, currentFilter, selectedCategory),
    sortBy
  );

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentFilter("all");
  };

  const handleFilterSelect = (filter: FilterOption) => {
    setCurrentFilter(filter);
    setSelectedCategory(null);
  };

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Sin Stock (0)</Badge>;
    }
    if (stock <= minStock) {
      return <Badge variant="warning">Bajo Stock ({stock})</Badge>;
    }
    return <Badge variant="success">{stock} unidades</Badge>;
  };

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
                  {(currentFilter !== 'all' || selectedCategory) && (
                    <Badge variant="secondary" className="ml-2">
                      {currentFilter !== 'all' ? currentFilter : selectedCategory}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal">Categoría</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
                  <Check className={`mr-2 h-4 w-4 ${!selectedCategory ? 'opacity-100' : 'opacity-0'}`} />
                  Todas
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => handleCategorySelect(category)}>
                    <Check className={`mr-2 h-4 w-4 ${selectedCategory === category ? 'opacity-100' : 'opacity-0'}`} />
                    {category}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal">Stock</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFilterSelect('all')}>
                  <Check className={`mr-2 h-4 w-4 ${currentFilter === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterSelect('low-stock')}>
                  <Check className={`mr-2 h-4 w-4 ${currentFilter === 'low-stock' ? 'opacity-100' : 'opacity-0'}`} />
                  Bajo Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterSelect('out-of-stock')}>
                  <Check className={`mr-2 h-4 w-4 ${currentFilter === 'out-of-stock' ? 'opacity-100' : 'opacity-0'}`} />
                  Sin Stock
                </DropdownMenuItem>
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
                <DropdownMenuItem onClick={() => setSortBy('name-asc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'name-asc' ? 'opacity-100' : 'opacity-0'}`} />
                  Nombre (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name-desc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'name-desc' ? 'opacity-100' : 'opacity-0'}`} />
                  Nombre (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-asc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'price-asc' ? 'opacity-100' : 'opacity-0'}`} />
                  Precio (Menor a Mayor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-desc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'price-desc' ? 'opacity-100' : 'opacity-0'}`} />
                  Precio (Mayor a Menor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('stock-asc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'stock-asc' ? 'opacity-100' : 'opacity-0'}`} />
                  Stock (Menor a Mayor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('stock-desc')}>
                  <Check className={`mr-2 h-4 w-4 ${sortBy === 'stock-desc' ? 'opacity-100' : 'opacity-0'}`} />
                  Stock (Mayor a Menor)
                </DropdownMenuItem>
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
              ) : filteredAndSortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron productos.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku || "-"}</TableCell>
                    <TableCell>{product.category || "-"}</TableCell>
                    <TableCell className="text-right">
                      ${product.unit_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStockBadge(product.current_stock, product.min_stock_level)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <ProductEditDialog 
                            product={product}
                            onProductUpdated={fetchProducts}
                          />
                          <DeleteProductDialog
                            product={product}
                            onProductDeleted={fetchProducts}
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