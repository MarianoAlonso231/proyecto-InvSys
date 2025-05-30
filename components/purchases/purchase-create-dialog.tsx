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
import { PlusCircle } from "lucide-react";
import CreatePurchaseForm from "./create-purchase-form";

export default function PurchaseCreateDialog({ onPurchaseCreated }: { onPurchaseCreated: () => void }) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onPurchaseCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Compra</DialogTitle>
        </DialogHeader>
        <CreatePurchaseForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
} 