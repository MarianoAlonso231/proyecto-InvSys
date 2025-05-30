"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createPurchase } from "@/lib/purchases";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { CreatePurchaseDTO, CreatePurchaseItemDTO } from "@/types/purchases";

// Esquema de validación para el formulario
const formSchema = z.object({
  supplier_id: z.string().min(1, "El proveedor es requerido"),
  reference_number: z.string().min(1, "El número de referencia es requerido"),
  status: z.enum(["pending", "received", "cancelled"]),
  payment_status: z.enum(["unpaid", "paid", "partial", "refunded"]),
  notes: z.string().optional(),
});

// Tipo para los productos seleccionados
type SelectedProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

export default function CreatePurchaseForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; unit_price: number }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
      payment_status: "unpaid",
      notes: "",
    },
  });

  useEffect(() => {
    // Cargar proveedores
    const fetchSuppliers = async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name");

      if (!error && data) {
        setSuppliers(data);
      }
    };

    // Cargar productos
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, unit_price")
        .order("name");

      if (!error && data) {
        setProducts(data);
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, []);

  const addProduct = () => {
    setSelectedProducts((prev) => [
      ...prev,
      {
        id: "",
        name: "",
        price: 0,
        quantity: 1,
        total: 0,
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              id: product.id,
              name: product.name,
              price: product.unit_price,
              quantity: item.quantity,
              total: product.unit_price * item.quantity,
            }
          : item
      )
    );
  };

  const updateQuantity = (index: number, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity,
              total: item.price * quantity,
            }
          : item
      )
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un producto",
        variant: "destructive",
      });
      return;
    }

    if (selectedProducts.some((p) => !p.id)) {
      toast({
        title: "Error",
        description: "Todos los productos deben estar seleccionados",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const purchase: CreatePurchaseDTO = {
        ...values,
        purchase_date: new Date().toISOString(),
        total_amount: selectedProducts.reduce((sum, item) => sum + item.total, 0),
      };

      const items: CreatePurchaseItemDTO[] = selectedProducts.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total,
        purchase_id: "", // Este valor se asigna en el backend
      }));

      await createPurchase(purchase, items);

      toast({
        title: "Éxito",
        description: "Compra creada correctamente",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la compra",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedProducts.reduce((sum, item) => sum + item.total, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="supplier_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Referencia</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="received">Recibido</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado de Pago</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado de pago" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unpaid">No Pagado</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Productos</h3>
            <Button type="button" variant="outline" size="sm" onClick={addProduct}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No hay productos seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedProducts.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={item.id}
                          onValueChange={(value) => updateProduct(index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(index, parseInt(e.target.value) || 0)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${item.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProduct(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {selectedProducts.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total:
                    </TableCell>
                    <TableCell className="font-medium">
                      ${totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Crear Compra
          </Button>
        </div>
      </form>
    </Form>
  );
} 