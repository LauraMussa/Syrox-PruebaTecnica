"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateSaleStatus } from "@/store/sales/salesSlice";
import { Sale, OrderStatus } from "@/types/sale.types";
import { toast } from "sonner";
import { Truck, CreditCard, User, MapPin, Package, X, History } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  sale: Sale | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700 border-green-200";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    case "PREPARING":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export function UpdateSaleModal({ sale, open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [trackingId, setTrackingId] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sale) {
      setStatus(sale.status);
      setTrackingId(sale.trackingId || "");
      setNote("");
    }
  }, [sale, open]);

  const handleSubmit = async () => {
    if (!sale) return;

    if (status === "SHIPPED" && !trackingId.trim()) {
      toast.error("El número de tracking es obligatorio para envíos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateSaleStatus({
          id: sale.id,
          status,
          trackingId: status === "SHIPPED" ? trackingId : "",
          // nota: note // Si agregas notas al backend, pásalo aquí
        })
      ).unwrap();

      toast.success("Estado de orden actualizado");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al actualizar la orden");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" /> Gestionar Orden
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          {/* 1. HEADER ESTADO ACTUAL */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Truck className="w-4 h-4" /> Estado Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor(sale.status)}`}>
                  {sale.status}
                </Badge>
                <span className="text-muted-foreground text-sm">Orden #{sale.orderNumber}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2. INFO CLIENTE */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="font-medium">{sale.customer.name}</div>
                <div className="text-muted-foreground">{sale.customer.email}</div>
                <div className="text-muted-foreground">{sale.customer.phone || "Sin teléfono"}</div>
                <div className="text-xs text-muted-foreground mt-2 font-mono bg-muted p-1 rounded w-fit">
                  ID: {sale.customer.id.split("-")[0]}...
                </div>
              </CardContent>
            </Card>

            {/* 3. INFO PAGO */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Método:</span>
                  <span className="font-medium">{sale.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge
                    variant={sale.paymentStatus === "PAID" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {sale.paymentStatus}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>${sale.total}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4. SECCIÓN DE ACCIONES (FORMULARIO) */}
          <Card className="border-blue-200 bg-blue-50/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Acciones Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cambiar Estado</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="PREPARING">En Preparación</SelectItem>
                      <SelectItem value="SHIPPED">Enviado / Despachado</SelectItem>
                      <SelectItem value="DELIVERED">Entregado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Input Tracking (Solo si es SHIPPED o DELIVERED) */}
                {(status === "SHIPPED" || status === "DELIVERED") && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                    <Label>Número de Tracking</Label>
                    <Input
                      placeholder="Ej: 1259486214"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Notas (Opcional visualmente) */}
              <div className="space-y-2">
                <Label>Notas para el cambio de estado (opcional)</Label>
                <Textarea
                  placeholder="Agregar notas sobre el cambio de estado..."
                  className="bg-white resize-none"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? "Guardando..." : "Actualizar Orden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
