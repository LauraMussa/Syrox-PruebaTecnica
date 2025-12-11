"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSaleById, createSale, updateSaleStatus, resetSelectedSale } from "@/store/sales/salesSlice";
import { fetchProducts } from "@/store/products/productsSlice";   // Asumo que tienes esto
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Truck, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { OrderStatus } from "@/types/sale.types";
import Link from "next/link";
import { fetchCustomers } from "@/store/customers/customerSlice";

export default function CreateOrEditSalePage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isNew = id === "new";

  // Selectores
  const { selectedSale, loadingSelected } = useAppSelector((state) => state.sales);
  const customers = useAppSelector((state) => state.customers.items);
  const products = useAppSelector((state) => state.products.items);

  // Estados Formulario Creación (Cart)
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("EFECTIVO");
  
  // Estados Formulario Edición (Status)
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [trackingId, setTrackingId] = useState("");

  // Estado Compartido (Nota)
  const [note, setNote] = useState("");

  // Carga inicial
  useEffect(() => {
    if (isNew) {
      dispatch(resetSelectedSale());
      dispatch(fetchCustomers()); // Cargar clientes para el select
      dispatch(fetchProducts());  // Cargar productos para el select
    } else {
      dispatch(fetchSaleById(id as string));
    }
  }, [id, isNew, dispatch]);

  // Rellenar datos si estamos en modo Edición
  useEffect(() => {
    if (!isNew && selectedSale) {
      setStatus(selectedSale.status);
      setTrackingId(selectedSale.trackingId || "");
      setNote(selectedSale.note || "");
    }
  }, [selectedSale, isNew]);

  // --- LOGICA DE CREACIÓN (Carrito) ---
  const handleAddItem = () => {
    setCartItems([...cartItems, { productId: "", quantity: 1 }]);
  };

  const updateCartItem = (index: number, field: string, value: any) => {
    const newItems = [...cartItems];
    // @ts-ignore
    newItems[index][field] = value;
    setCartItems(newItems);
  };

  const removeCartItem = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
  };

  const handleCreateSubmit = async () => {
    if (!selectedCustomerId || cartItems.length === 0) {
        toast.error("Selecciona cliente y al menos un producto");
        return;
    }

    try {
      await dispatch(createSale({
        customerId: selectedCustomerId,
        items: cartItems,
        paymentMethod,
        note 
      })).unwrap();
      toast.success("Venta creada correctamente");
      router.push("/sales");
    } catch (err) {
      toast.error("Error al crear venta");
    }
  };

  // --- LOGICA DE EDICIÓN (Status) ---
  const handleUpdateSubmit = async () => {
    try {
      await dispatch(updateSaleStatus({
        id: id as string,
        status,
        trackingId: status === "SHIPPED" ? trackingId : undefined,
        note // <--- Enviamos la nota editada
      })).unwrap();
      toast.success("Venta actualizada");
      router.push("/sales");
    } catch (err) {
      toast.error("Error al actualizar");
    }
  };

  if (loadingSelected) return <div className="p-10">Cargando...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
            <Link href="/sales"><ArrowLeft className="w-5 h-5"/></Link>
        </Button>
        <h1 className="text-2xl font-bold">
            {isNew ? "Nueva Venta" : `Gestionar Orden #${selectedSale?.orderNumber || ''}`}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMNA PRINCIPAL (Formulario) */}
        <div className="md:col-span-2 space-y-6">
            
            {/* MODO CREACIÓN: Selección de Cliente y Productos */}
            {isNew ? (
                <>
                    <Card>
                        <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
                        <CardContent>
                             <Select onValueChange={setSelectedCustomerId}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar Cliente" /></SelectTrigger>
                                <SelectContent>
                                    {customers?.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Productos</CardTitle>
                            <Button size="sm" onClick={handleAddItem}><Plus className="w-4 h-4 mr-2"/> Agregar</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Label>Producto</Label>
                                        <Select onValueChange={(val) => updateCartItem(index, 'productId', val)}>
                                            <SelectTrigger><SelectValue placeholder="Producto..." /></SelectTrigger>
                                            <SelectContent>
                                                {products?.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name} - ${p.price}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-24">
                                        <Label>Cant.</Label>
                                        <Input type="number" min={1} value={item.quantity} onChange={(e) => updateCartItem(index, 'quantity', parseInt(e.target.value))} />
                                    </div>
                                    <Button variant="destructive" size="icon" onClick={() => removeCartItem(index)}><Trash className="w-4 h-4"/></Button>
                                </div>
                            ))}
                             {cartItems.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No hay productos agregados</p>}
                        </CardContent>
                    </Card>
                </>
            ) : (
                /* MODO EDICIÓN: Vista de Info (Solo lectura) */
                <Card>
                    <CardHeader><CardTitle>Detalle del Pedido</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Cliente</Label>
                                <p className="font-medium">{selectedSale?.customer?.name}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Total</Label>
                                <p className="font-medium text-lg">${selectedSale?.total}</p>
                            </div>
                        </div>
                        <div>
                             <Label className="text-muted-foreground">Productos</Label>
                             <ul className="list-disc list-inside mt-1">
                                {selectedSale?.items?.map((item: any) => (
                                    <li key={item.id}>{item.productName} x {item.quantity}</li>
                                ))}
                             </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* SECCION NOTA (Compartida para New y Edit) */}
            <Card>
                <CardHeader><CardTitle>Notas de la Venta</CardTitle></CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Escribe observaciones, instrucciones especiales, etc."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                    />
                </CardContent>
            </Card>

        </div>

        {/* COLUMNA LATERAL (Acciones y Status) */}
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Acciones</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    
                    {/* Select de Estado (Solo visible en EDIT o predefinido en NEW) */}
                    {!isNew && (
                        <div className="space-y-2">
                            <Label>Estado del Pedido</Label>
                            <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pendiente</SelectItem>
                                    <SelectItem value="PREPARING">En Preparación</SelectItem>
                                    <SelectItem value="SHIPPED">Enviado</SelectItem>
                                    <SelectItem value="DELIVERED">Entregado</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Input Tracking (Solo Edit y si es Shipped) */}
                    {!isNew && (status === 'SHIPPED' || status === 'DELIVERED') && (
                        <div className="space-y-2">
                             <Label>Tracking ID</Label>
                             <Input 
                                placeholder="Ej: MX-123456" 
                                value={trackingId} 
                                onChange={(e) => setTrackingId(e.target.value)} 
                             />
                        </div>
                    )}

                    {/* Método de Pago (Solo New) */}
                    {isNew && (
                        <div className="space-y-2">
                            <Label>Método de Pago</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                                    <SelectItem value="TARJETA">Tarjeta</SelectItem>
                                    <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    
                    <Button className="w-full" onClick={isNew ? handleCreateSubmit : handleUpdateSubmit}>
                        <Save className="w-4 h-4 mr-2"/>
                        {isNew ? "Crear Venta" : "Guardar Cambios"}
                    </Button>

                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
