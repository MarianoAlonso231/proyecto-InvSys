"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductCreateForm({ onProductCreated, initialData }: { onProductCreated: () => void, initialData?: Database["public"]["Tables"]["products"]["Row"] | null }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    sku: initialData?.sku || "",
    category: initialData?.category || "",
    unit_price: initialData?.unit_price?.toString() || "",
    current_stock: initialData?.current_stock?.toString() || "",
    min_stock_level: initialData?.min_stock_level?.toString() || ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let imageUrl = initialData?.image_url || null;
    try {
      if (imageFile) {
        const { data, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(`products/${Date.now()}_${imageFile.name}`, imageFile, { upsert: true });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path).data.publicUrl;
      }
      if (initialData) {
        // Actualizar producto existente
        const { error: updateError } = await supabase
          .from("products")
          .update({
            name: form.name,
            sku: form.sku,
            category: form.category,
            unit_price: form.unit_price,
            current_stock: form.current_stock,
            min_stock_level: form.min_stock_level,
            description: form.description,
            image_url: imageUrl,
          })
          .eq("id", initialData.id);
        if (updateError) throw updateError;
        setSuccess("Producto actualizado exitosamente");
      } else {
        // Crear producto nuevo
        const { error: insertError } = await supabase
          .from("products")
          .insert({
            name: form.name,
            sku: form.sku,
            category: form.category,
            unit_price: form.unit_price,
            current_stock: form.current_stock,
            min_stock_level: form.min_stock_level,
            description: form.description,
            image_url: imageUrl,
          });
        if (insertError) throw insertError;
        setSuccess("Producto creado exitosamente");
      }
      onProductCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Crear Producto</h2>
        <p className="text-gray-400">Ingresa los detalles del nuevo producto</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid de campos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nombre *</label>
            <Input 
              name="name" 
              placeholder="Nombre del producto" 
              value={form.name} 
              onChange={handleChange} 
              required 
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">SKU</label>
            <Input 
              name="sku" 
              placeholder="Código SKU" 
              value={form.sku} 
              onChange={handleChange} 
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Categoría</label>
            <Input 
              name="category" 
              placeholder="Categoría del producto" 
              value={form.category} 
              onChange={handleChange} 
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Precio Unitario *</label>
            <Input 
              name="unit_price" 
              placeholder="0.00" 
              value={form.unit_price} 
              onChange={handleChange} 
              type="number" 
              step="0.01"
              required 
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Stock Actual *</label>
            <Input 
              name="current_stock" 
              placeholder="0" 
              value={form.current_stock} 
              onChange={handleChange} 
              type="number" 
              required 
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Stock Mínimo</label>
            <Input 
              name="min_stock_level" 
              placeholder="0" 
              value={form.min_stock_level} 
              onChange={handleChange} 
              type="number" 
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Descripción</label>
          <Input 
            name="description" 
            placeholder="Descripción detallada del producto" 
            value={form.description} 
            onChange={handleChange} 
            className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500/20"
          />
        </div>

        {/* Imagen del producto */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Imagen del Producto</label>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 file:cursor-pointer cursor-pointer bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/20"
            />
          </div>
          {imageFile && (
            <p className="text-xs text-gray-400 mt-1">
              Archivo seleccionado: {imageFile.name}
            </p>
          )}
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Botón de envío */}
        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed font-medium py-3 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                {initialData ? "Actualizando..." : "Guardando..."}
              </div>
            ) : (
              initialData ? "Actualizar Producto" : "Crear Producto"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}