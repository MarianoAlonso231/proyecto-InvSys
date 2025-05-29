"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Loader2, ImagePlus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import Image from "next/image";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface FormData {
  name: string;
  description: string;
  sku: string;
  category: string;
  unit_price: string;
  current_stock: string;
  min_stock_level: string;
  image: File | null;
  image_url: string | null;
}

export default function ProductEditDialog({
  product,
  onProductUpdated,
}: {
  product: Product;
  onProductUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: product.name,
    description: product.description || "",
    sku: product.sku || "",
    category: product.category || "",
    unit_price: product.unit_price.toString(),
    current_stock: product.current_stock.toString(),
    min_stock_level: (product.min_stock_level || 0).toString(),
    image: null,
    image_url: product.image_url,
  });
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ 
        ...prev, 
        image: e.target.files![0],
        image_url: null // Limpiar la URL anterior cuando se selecciona una nueva imagen
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ 
      ...prev, 
      image: null,
      image_url: null 
    }));
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let image_url = formData.image_url;
      
      if (formData.image) {
        image_url = await uploadImage(formData.image);
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          sku: formData.sku,
          category: formData.category,
          unit_price: parseFloat(formData.unit_price),
          current_stock: parseInt(formData.current_stock),
          min_stock_level: parseInt(formData.min_stock_level) || 0,
          image_url: image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });
      onProductUpdated();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar Producto</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sku: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">Precio Unitario *</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unit_price: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock">Stock Actual *</Label>
              <Input
                id="current_stock"
                type="number"
                value={formData.current_stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    current_stock: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_stock_level">Stock Mínimo</Label>
              <Input
                id="min_stock_level"
                type="number"
                value={formData.min_stock_level}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    min_stock_level: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen del Producto</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                {formData.image_url ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </Button>
              {(formData.image || formData.image_url) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formData.image && (
              <p className="text-sm text-muted-foreground mt-2">
                Nueva imagen seleccionada: {formData.image.name}
              </p>
            )}
            {formData.image_url && !formData.image && (
              <div className="mt-2 relative w-32 h-32">
                <Image
                  src={formData.image_url}
                  alt="Imagen del producto"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 