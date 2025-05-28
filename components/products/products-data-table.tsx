"use client";

import Link from "next/link";
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
  AlertTriangle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import ProductCreateForm from "@/components/products/product-create-form";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default function ProductsDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [products, setProducts] = useState<Database["public"]["Tables"]["products"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Database["public"]["Tables"]["products"]["Row"] | null>(null);

  // Mueve fetchProducts fuera del useEffect para poder llamarlo después
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*");
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
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
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                Manage your product catalog and stock levels
              </CardDescription>
            </div>
            <Button className="shrink-0" size="sm" onClick={() => setShowCreateForm((v) => !v)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {showCreateForm ? "Close" : "Add Product"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <ProductCreateForm onProductCreated={() => {
              setShowCreateForm(false);
              fetchProducts(); // Recarga los productos después de crear uno nuevo
            }} />
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 sm:max-w-xs">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
                  <DropdownMenuItem>Category</DropdownMenuItem>
                  <DropdownMenuItem>Low Stock</DropdownMenuItem>
                  <DropdownMenuItem>Out of Stock</DropdownMenuItem>
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
                  <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                  <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                  <DropdownMenuItem>Price (Low to High)</DropdownMenuItem>
                  <DropdownMenuItem>Price (High to Low)</DropdownMenuItem>
                  <DropdownMenuItem>Stock (Low to High)</DropdownMenuItem>
                  <DropdownMenuItem>Stock (High to Low)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                  <TableHead>Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
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
                              Low
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this product?')) {
                                const { error } = await supabase
                                  .from('products')
                                  .delete()
                                  .eq('id', product.id);
                                
                                if (!error) {
                                  fetchProducts();
                                } else {
                                  console.error('Error deleting product:', error);
                                }
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin imagen</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de edición condicional */}
      {editingProduct && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>
              Update product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductCreateForm
              key={editingProduct.id}
              onProductCreated={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
              initialData={editingProduct}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
}