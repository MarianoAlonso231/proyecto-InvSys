"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { deletePurchase } from "@/lib/purchases";
import { Purchase } from "@/types/purchases";

interface Props {
  purchase: Purchase;
  onPurchaseDeleted: () => void;
}

export default function PurchaseDeleteDialog({ purchase, onPurchaseDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deletePurchase(purchase.id);

      toast({
        title: "Éxito",
        description: "Compra eliminada correctamente",
      });

      setOpen(false);
      onPurchaseDeleted();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la compra",
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
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="sr-only">Eliminar compra</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Compra</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar esta compra? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 