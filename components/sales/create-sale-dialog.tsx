"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateSaleForm from "./create-sale-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";

export default function CreateSaleDialog({
  onSaleCreated,
}: {
  onSaleCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    unit_price: number;
  }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, unit_price")
      .gt("current_stock", 0);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
      return;
    }

    setProducts(data);
  };

  const handleSuccess = () => {
    setOpen(false);
    onSaleCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Venta</DialogTitle>
        </DialogHeader>
        <CreateSaleForm onSuccess={handleSuccess} products={products} />
      </DialogContent>
    </Dialog>
  );
} 