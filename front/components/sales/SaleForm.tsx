"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSaleById, createSale, updateSaleStatus, resetSelectedSale } from "@/store/sales/salesSlice";
import { fetchProducts } from "@/store/products/productsSlice";
import { fetchCustomers } from "@/store/customers/customerSlice";
// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { OrderStatus } from "@/types/sale.types";

// Forms & Validation
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSaleFormSchema, SaleFormValues, updateSaleSchema } from "@/schemas/saleForm.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface SaleFormProps {
  saleId?: string;
}

export function SaleForm({ saleId }: SaleFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isNew = !saleId;
  const schema = isNew ? createSaleFormSchema : updateSaleSchema;

  // --- SELECTORES ---
  const { selectedSale, loadingSelected } = useAppSelector((state) => state.sales);
  const customers = useAppSelector((state) => state.customers.items);
  const products = useAppSelector((state) =>
    state.products.items.filter((p) => p.stock > 0 && p.isActive == true)
  );

  // --- CONFIGURACIÓN DEL FORMULARIO ---
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customerId: "",
      paymentMethod: "EFECTIVO",
      note: "",
      items: [],
      status: "PENDING",
      trackingId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // --- EFECTOS ---

  // 1. Carga inicial de datos
  useEffect(() => {
    if (isNew) {
      dispatch(resetSelectedSale());
      dispatch(fetchCustomers());
      dispatch(fetchProducts());
    } else if (saleId) {
      dispatch(fetchSaleById(saleId));
    }
  }, [saleId, isNew, dispatch]);

  // 2. Rellenar formulario en modo EDICIÓN
  useEffect(() => {
    if (!isNew && selectedSale) {
      form.reset({
        status: selectedSale.status,
        trackingId: selectedSale.trackingId || "",
        note: selectedSale.note || "",
      });
    }
  }, [selectedSale, isNew, form]);

  // --- HANDLERS ---

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    form.setValue(`items.${index}.productId`, productId);
    form.setValue(`items.${index}.maxStock`, product?.stock || 0);
    form.trigger(`items.${index}.quantity`);
    form.clearErrors(`items.${index}.productId`);
  };

  const onSubmit = async (data: SaleFormValues) => {
    try {
      if (isNew) {
        const payloadItems = data.items.map(({ productId, quantity }) => ({
          productId,
          quantity,
        }));

        await dispatch(
          createSale({
            customerId: data.customerId,
            paymentMethod: data.paymentMethod,
            note: data.note,
            items: payloadItems,
          })
        ).unwrap();

        toast.success("Venta creada exitosamente");
      } else {
        if (!saleId) return;

        await dispatch(
          updateSaleStatus({
            id: saleId,
            status: data.status as OrderStatus,
            trackingId: data.status === "SHIPPED" ? data.trackingId : undefined,
            note: data.note,
          })
        ).unwrap();

        toast.success("Venta actualizada exitosamente");
      }
      router.push("/sales");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Error al guardar la venta");
    }
  };

  if (loadingSelected && !isNew) return <div className="p-10 text-center">Cargando datos...</div>;
  console.log("Errores:", form.formState.errors);
  console.log("Es válido:", form.formState.isValid);
  return (
    <Form {...form}>
      {/* CAMBIO 1: w-full y padding en lugar de max-w-5xl */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full p-4 lg:p-8 pb-20">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild type="button">
              <Link href="/sales">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isNew ? "Nueva Venta" : `Orden #${selectedSale?.orderNumber}`}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isNew
                  ? "Complete los detalles para registrar una nueva venta."
                  : "Administre el estado y seguimiento del pedido."}
              </p>
            </div>
          </div>
        </div>

        {/* CAMBIO 2: Grid responsivo más amplio (xl:grid-cols-4) */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-8">
          {/* COLUMNA PRINCIPAL (Ocupa 3/4 en pantallas muy grandes) */}
          <div className="xl:col-span-3 lg:col-span-2 space-y-6">
            {isNew && (
              <>
                {/* 1. SELECCIÓN DE CLIENTE */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="customerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente Registrado</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 cursor-pointer">
                                <SelectValue placeholder="Buscar cliente..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {customers.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name} ({c.email})
                                  {}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="flex flex-row justify-between items-center ">
                    <CardTitle>Carrito de Compras</CardTitle>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        append({ productId: "", quantity: 1, maxStock: 0 });
                        form.clearErrors("items");
                      }}
                      className="cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Agregar Item
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0 divide-y">
                      {fields.length > 0 && (
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                          <div className="col-span-6 md:col-span-7">Producto</div>
                          <div className="col-span-3 md:col-span-2">Cantidad</div>
                          <div className="col-span-3 md:col-span-3 text-right">Acciones</div>
                        </div>
                      )}

                      {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-12 gap-4 p-4 items-start">
                          <div className="col-span-6 md:col-span-7">
                            <FormField
                              control={form.control}
                              name={`items.${index}.productId`}
                              render={({ field: pField }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={(val) => handleProductChange(index, val)}
                                    value={pField.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="cursor-pointer">
                                        <SelectValue placeholder="Seleccionar producto..." />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {products.map((p) => (
                                        <SelectItem key={p.id} value={p.id} disabled={p.stock <= 0}>
                                          <div className="flex justify-between w-full gap-4">
                                            <span>{p.name}</span>
                                            <span className="text-muted-foreground font-mono">
                                              Stock: {p.stock} | ${p.price}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Cantidad Input */}
                          <div className="col-span-3 md:col-span-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field: qField }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={1}
                                      {...qField}
                                      onChange={(e) => qField.onChange(parseInt(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="col-span-3 md:col-span-3 flex  justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-warning/90 cursor-pointer dark:hover:text-warning dark:hover:bg-transparent hover:bg-transparent hover:text-warning  "
                            >
                              <Trash className="w-4 h-4 mb-1 " />
                              <p>Eliminar</p>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {fields.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground border-2 border-dashed m-6 rounded-lg">
                        <p>El carrito está vacío.</p>
                        <Button
                          variant="link"
                          onClick={() => append({ productId: "", quantity: 1, maxStock: 0 })}
                        >
                          Agregar primer producto
                        </Button>
                      </div>
                    )}
                    <div className="px-6 pb-4">
                      <FormMessage>
                        {form.formState.errors.items?.message || form.formState.errors.items?.root?.message}
                      </FormMessage>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!isNew && selectedSale && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la Orden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-muted/20 rounded-lg">
                    <div>
                      <p className="text-muted-foreground">Cliente</p>
                      <p className="font-medium text-lg">{selectedSale.customer.name}</p>
                      <p>{selectedSale.customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-bold text-2xl text-primary">${selectedSale.total}</p>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">Producto</th>
                          <th className="px-4 py-2 text-right">Cant.</th>
                          <th className="px-4 py-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedSale.items.map((item: any) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">{item.product.name}</td>
                            <td className="px-4 py-3 text-right font-mono">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-mono">${item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Notas y Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {isNew ? (
                          <Textarea
                            {...field}
                            placeholder="Observaciones sobre el pedido..."
                            className="min-h-[100px]"
                          />
                        ) : (
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 rounded-md border border-yellow-200 dark:border-yellow-900">
                            {form.getValues("note") || "Sin notas adicionales."}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* COLUMNA LATERAL (Sticky para que siempre esté visible) */}
          <div className="space-y-6 h-fit xl:sticky xl:top-6">
            <Card className="border-l-4 border-l-primary shadow-md">
              <CardHeader>
                <CardTitle>Publicar Venta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isNew && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado del Pedido</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">🕒 Pendiente</SelectItem>
                            <SelectItem value="PREPARING">📦 En Preparación</SelectItem>
                            <SelectItem value="SHIPPED">🚚 Enviado</SelectItem>
                            <SelectItem value="DELIVERED">✅ Entregado</SelectItem>
                            <SelectItem value="CANCELLED">❌ Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!isNew && form.watch("status") === "SHIPPED" && (
                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej: MX-123456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isNew && (
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pago</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                            <SelectItem value="TARJETA">Tarjeta</SelectItem>
                            <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="pt-4 border-t">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-base font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isNew ? "Finalizar Venta" : "Guardar Cambios"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
