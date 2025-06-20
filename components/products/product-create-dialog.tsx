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
import { PlusCircle, Loader2, ImagePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";

interface FormData {
  name: string;
  description: string;
  sku: string;
  category: string;
  unit_price: string;
  current_stock: string;
  min_stock_level: string;
  image: File | null;
}

export default function ProductCreateDialog({
  onProductCreated,
}: {
  onProductCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    sku: "",
    category: "",
    unit_price: "",
    current_stock: "",
    min_stock_level: "",
    image: null,
  });
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
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
      // Verificar la sesión primero
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error de sesión:', sessionError);
        throw new Error('Error de autenticación');
      }
      
      if (!session) {
        console.error('No hay sesión activa');
        throw new Error('No hay sesión activa');
      }

      // Verificar si el SKU ya existe (solo si se proporcionó un SKU)
      if (formData.sku) {
        const { data: existingProduct, error: skuCheckError } = await supabase
          .from("products")
          .select("id")
          .eq("sku", formData.sku)
          .single();

        if (skuCheckError && skuCheckError.code !== 'PGRST116') { // PGRST116 significa que no se encontró el SKU
          console.error('Error al verificar SKU:', skuCheckError);
          throw skuCheckError;
        }

        if (existingProduct) {
          throw new Error('Ya existe un producto con este SKU');
        }
      }

      let image_url = null;
      if (formData.image) {
        image_url = await uploadImage(formData.image);
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          name: formData.name,
          description: formData.description || null,
          sku: formData.sku || null,
          category: formData.category || null,
          unit_price: parseFloat(formData.unit_price),
          current_stock: parseInt(formData.current_stock),
          min_stock_level: parseInt(formData.min_stock_level) || 0,
          image_url: image_url,
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear producto:', error);
        if (error.code === '23505') {
          throw new Error('Ya existe un producto con este SKU');
        }
        throw error;
      }

      console.log('Producto creado:', data);

      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      });
      onProductCreated();
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        sku: "",
        category: "",
        unit_price: "",
        current_stock: "",
        min_stock_level: "",
        image: null,
      });
    } catch (error: any) {
      console.error('Error detallado:', error);
      toast({
        title: "Error al crear producto",
        description: error.message || "No se pudo crear el producto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
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
                placeholder="Opcional - debe ser único"
              />
              <p className="text-sm text-muted-foreground">
                Si se proporciona, debe ser único para cada producto
              </p>
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
                Seleccionar Imagen
              </Button>
              {formData.image && (
                <span className="text-sm text-muted-foreground">
                  {formData.image.name}
                </span>
              )}
            </div>
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
                  Creando...
                </>
              ) : (
                "Crear Producto"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 