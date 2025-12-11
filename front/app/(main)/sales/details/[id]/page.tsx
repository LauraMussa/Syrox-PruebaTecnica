"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, MapPin, CreditCard, Package } from "lucide-react";
import Link from "next/link";

// Tipos y Servicios
import { Sale, SaleItem } from "@/types/sale.types";
import { getSaleByIdService } from "@/services/sales.service";

// Componentes UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SaleDetailSkeleton } from "@/components/skeletons/details/SaleDetailSkeleton";
import { fetchSaleById } from "@/store/sales/salesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// Helpers (Reutiliza los mismos de la lista)
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SaleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { selectedSale, loadingSelected } = useAppSelector((state: any) => state.sales);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (id) {
      dispatch(fetchSaleById(id as string));
    }
  }, [id, dispatch]);

  if (loadingSelected) return <SaleDetailSkeleton />;
  if (!selectedSale) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Venta no encontrada.</p>
        <Button variant="link" asChild>
          <Link href="/sales">Volver</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto bg-background min-h-screen animate-in fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link href="/sales" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Orden #{selectedSale.orderNumber}</h1>
            <Badge variant="outline" className={getStatusColor(selectedSale.status)}>
              {selectedSale.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            Realizada el {formatDate(selectedSale.createdAt)}
          </p>
        </div>

        <div className="flex gap-2 ml-8 md:ml-0">
          {/* Aquí podrías poner botones de acción como "Imprimir", "Cancelar Pedido", etc. */}
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir Comprobante
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA PRINCIPAL: ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Cant.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSale.items.map((item: SaleItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {item.product.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-col items-end gap-2 pt-6 border-t mt-4">
                <div className="flex justify-between w-full max-w-[250px] text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[250px] text-sm">
                  <span className="text-muted-foreground">Envío:</span>
                  <span>$0,00</span>
                </div>
                <Separator className="my-2 w-full max-w-[250px]" />
                <div className="flex justify-between w-full max-w-[250px] text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA LATERAL: CLIENTE Y PAGO */}
        <div className="space-y-6">
          {/* Cliente Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback>{selectedSale.customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{selectedSale.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedSale.customer.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{selectedSale.customer.address || "Sin dirección registrada"}</span>
                </div>
                <div className="pl-6">Tel: {selectedSale.customer.phone || "-"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Pago Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" /> Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estado:</span>
                <Badge
                  variant={selectedSale.paymentStatus === "PAID" ? "default" : "destructive"}
                  className="text-[10px]"
                >
                  {selectedSale.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Método:</span>
                <span className="font-medium text-sm">{selectedSale.paymentMethod}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
