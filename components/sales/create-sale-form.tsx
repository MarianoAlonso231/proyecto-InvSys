"use client";

import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { createSale } from "@/lib/sales";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { CreateSaleDTO, CreateSaleItemDTO } from "@/types/sales";

// Esquema de validación para el formulario
const formSchema = z.object({
  customer_name: z.string().min(1, "El nombre del cliente es requerido"),
  reference_number: z.string().min(1, "El número de referencia es requerido"),
  payment_method: z.enum(["cash", "credit_card", "bank_transfer"]),
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

export default function CreateSaleForm({
  onSuccess,
  products,
}: {
  onSuccess: () => void;
  products: Array<{ id: string; name: string; unit_price: number }>;
}) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      reference_number: "",
      payment_method: "cash",
      notes: "",
    },
  });

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setSelectedProducts([
      ...selectedProducts,
      {
        id: product.id,
        name: product.name,
        price: product.unit_price,
        quantity: 1,
        total: product.unit_price,
      },
    ]);
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newProducts = [...selectedProducts];
    newProducts[index].quantity = quantity;
    newProducts[index].total = quantity * newProducts[index].price;
    setSelectedProducts(newProducts);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((sum, product) => sum + product.total, 0);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un producto",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const saleData: CreateSaleDTO = {
        ...values,
        sale_date: new Date(),
        total_amount: getTotalAmount(),
        status: "completed",
      };

      const saleItems: CreateSaleItemDTO[] = selectedProducts.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
        unit_price: product.price,
        total_price: product.total,
        sale_id: "", // Este valor se asignará en el backend
      }));

      await createSale(saleData, saleItems);
      toast({
        title: "Éxito",
        description: "Venta creada correctamente",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la venta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del cliente" {...field} />
                </FormControl>
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
                  <Input placeholder="Ej: INV-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pago</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método de pago" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="bank_transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Input placeholder="Notas adicionales" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Productos</h3>
              <Select onValueChange={addProduct}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Agregar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No hay productos seleccionados
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={product.quantity}
                            onChange={(e) =>
                              updateQuantity(index, parseInt(e.target.value) || 0)
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          ${product.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(index)}
                          >
                            <Trash2 className="h-4 w-4" />
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
                      <TableCell className="text-right font-medium">
                        ${getTotalAmount().toFixed(2)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Venta
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 