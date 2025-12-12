"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSaleById, createSale, updateSaleStatus, resetSelectedSale } from "@/store/sales/salesSlice";
import { fetchProducts } from "@/store/products/productsSlice";
import { fetchCustomers, addCustomer } from "@/store/customers/customerSlice";
// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash, Loader2, Package, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image"; // Importamos Image
import { OrderStatus } from "@/types/sale.types";

// Forms & Validation
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSaleFormSchema, SaleFormValues, updateSaleSchema } from "@/schemas/saleForm.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { OptiontSelector } from "./OptionSelector";

interface SaleFormProps {
  saleId?: string;
}

export function SaleForm({ saleId }: SaleFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isNew = !saleId;
  const schema = isNew ? createSaleFormSchema : updateSaleSchema;

  const { selectedSale, loadingSelected } = useAppSelector((state) => state.sales);
  const customers = useAppSelector((state) => state.customers.items);
  const products = useAppSelector((state) =>
    state.products.items.filter((p) => p.stock > 0 && p.isActive == true)
  );
  const { user } = useAppSelector((state) => state.auth);

  const [currentUserDetails, setCurrentUserDetails] = useState({
    address: "",
    phone: "",
    name: user?.name || "",
  });
  useEffect(() => {
    if (user?.name) {
      setCurrentUserDetails((prev) => ({ ...prev, name: user.name || "" }));
    }
  }, [user]);
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
  const { isSubmitting } = form.formState;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  //Carga inicial de datos
  useEffect(() => {
    if (isNew) {
      dispatch(resetSelectedSale());
      dispatch(fetchCustomers());
      dispatch(fetchProducts());
    } else if (saleId) {
      dispatch(fetchSaleById(saleId));
    }
  }, [saleId, isNew, dispatch]);

  // modo EDICIÓN
  useEffect(() => {
    if (!isNew && selectedSale) {
      form.reset({
        status: selectedSale.status,
        trackingId: selectedSale.trackingId || "",
        note: selectedSale.note || "",
      });
    }
  }, [selectedSale, isNew, form]);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    form.setValue(`items.${index}.productId`, productId);
    form.setValue(`items.${index}.maxStock`, product?.stock || 0);
    form.trigger(`items.${index}.quantity`);
    form.clearErrors(`items.${index}.productId`);
  };

  const onSubmit = async (data: SaleFormValues) => {
    try {
      let finalCustomerId = data.customerId;

      if (finalCustomerId === "CURRENT_USER") {
        if (!user) {
          toast.error("No se pudo identificar al usuario actual");
          return;
        }
        if (!currentUserDetails.address || !currentUserDetails.phone) {
          toast.error("Por favor completa dirección y teléfono");
          return;
        }

        const existingCustomer = customers.find((c) => c.email === user.email);

        if (existingCustomer) {
          finalCustomerId = existingCustomer.id;
        } else {
          try {
            const newCustomerAction = await dispatch(
              addCustomer({
                name: currentUserDetails.name,
                email: user.email,
                address: currentUserDetails.address,
                phone: currentUserDetails.phone,
              })
            ).unwrap();

            finalCustomerId = newCustomerAction.id;
          } catch (createError: any) {
            console.error("Fallo al crear cliente:", createError);
            toast.error(`Error creando cliente: ${createError}`);
            return;
          }
        }

        toast.success("Cliente registrado correctamente");
      }

      if (isNew) {
        const payloadItems = data.items.map(({ productId, quantity }) => ({
          productId,
          quantity,
        }));

        await dispatch(
          createSale({
            customerId: finalCustomerId,
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto p-4 md:p-6 pb-24 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild type="button" className="h-10 w-10">
              <Link href="/sales">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {isNew ? "Nueva Venta" : `Orden #${selectedSale?.orderNumber}`}
              </h1>
              <p className="text-muted-foreground">
                {isNew
                  ? "Complete los detalles para registrar una venta."
                  : "Gestione el estado de la orden actual."}
              </p>
            </div>
          </div>
        </div>

        {isNew && (
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <CardTitle>Cliente</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccionar Cliente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 p-6 text-base cursor-pointer">
                          <SelectValue placeholder="Buscar cliente..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {user && (
                          <SelectItem
                            value="CURRENT_USER"
                            className="font-semibold text-primary bg-primary/5"
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium"> Yo ({user.name})</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </SelectItem>
                        )}
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{c.name}</span>
                              <span className="text-xs text-muted-foreground">{c.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("customerId") === "CURRENT_USER" && (
                <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-muted/30 rounded-lg border border-dashed">
                  <div className="space-y-2">
                    <FormLabel>Dirección de Envío *</FormLabel>
                    <Input
                      placeholder="Calle 123, Ciudad"
                      value={currentUserDetails.address}
                      onChange={(e) =>
                        setCurrentUserDetails((prev) => ({ ...prev, address: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Teléfono *</FormLabel>
                    <Input
                      placeholder="+54 9 11..."
                      value={currentUserDetails.phone}
                      onChange={(e) => setCurrentUserDetails((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground col-span-2">
                    * Completar estos datos registrará automáticamente un nuevo cliente con tu información.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isNew ? (
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <CardTitle>Productos</CardTitle>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    append({ productId: "", quantity: 1, maxStock: 0 });
                    form.clearErrors("items");
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Agregar Producto
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {fields.map((field, index) => {
                  const currentProductId = form.watch(`items.${index}.productId`);
                  const selectedProduct = products.find((p) => p.id === currentProductId);

                  return (
                    <div key={field.id} className="p-6 transition-colors hover:bg-muted/5">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full space-y-4">
                          <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="shrink-0">
                              <div className="relative w-18 h-18 rounded-lg border bg-white overflow-hidden shadow-sm">
                                {selectedProduct ? (
                                  <Image
                                    src={selectedProduct.images?.[0] || "/placeholder.png"}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-contain p-2"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                                    <Package className="w-8 h-8 opacity-20" />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex-1 w-full flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                              <FormField
                                control={form.control}
                                name={`items.${index}.productId`}
                                render={({ field: pField }) => (
                                  <FormItem className="w-full xl:w-1/3 min-w-[250px]">
                                    <FormLabel>Producto</FormLabel>
                                    <Select
                                      onValueChange={(val) => handleProductChange(index, val)}
                                      value={pField.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12 p-6 cursor-pointer">
                                          <SelectValue placeholder="Buscar producto..." />
                                        </SelectTrigger>
                                      </FormControl>

                                      <SelectContent className="max-h-[300px]">
                                        {products.map((p) => (
                                          <SelectItem
                                            key={p.id}
                                            value={p.id}
                                            disabled={p.stock <= 0}
                                            className="py-3"
                                          >
                                            <div className="flex items-center gap-3 p-2">
                                              <div className="flex flex-col text-left">
                                                <span className="font-medium">{p.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  Stock: {p.stock} | ${p.price}
                                                </span>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {selectedProduct?.options && (
                                <div className="w-full xl:flex-1">
                                  <OptiontSelector
                                    product={selectedProduct}
                                    onVariantSelected={(variantId, stock) => {
                                      form.setValue(`items.${index}.variantId`, variantId);
                                      form.setValue(`items.${index}.maxStock`, stock);
                                      form.clearErrors(`items.${index}.variantId`);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {form.formState.errors.items?.[index]?.variantId && (
                            <p className="text-sm text-red-500 mt-0 ml-28">
                              Debes seleccionar talle y color.
                            </p>
                          )}
                        </div>

                        <div className="flex items-end gap-3 w-full md:w-auto">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field: qField }) => (
                              <FormItem className="w-24">
                                <FormLabel>Cantidad</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-12 text-center text-lg"
                                    {...qField}
                                    onChange={(e) => qField.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            className="h-12 w-12 shrink-0  bg-transparent text-destructive/90 cursor-pointer hover:bg-transparent dark:hover:bg-transparent dark:bg-transparent hover:text-destructive"
                            title="Eliminar producto"
                          >
                            <Trash className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {fields.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/5">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p className="mb-4 text-lg font-medium">El carrito está vacío</p>
                  <Button
                    variant="outline"
                    onClick={() => append({ productId: "", quantity: 1, maxStock: 0 })}
                    className="cursor-pointer"
                  >
                    Agregar primer producto
                  </Button>
                </div>
              )}

              {/* Error global de items */}
              {form.formState.errors.items?.root && (
                <p className="text-red-500 text-center p-4 text-sm font-medium bg-red-50">
                  {form.formState.errors.items.root.message}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          selectedSale && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedSale.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-muted/20 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        {/* Imagen pequeña en lista de lectura */}
                        <div className="h-12 w-12 bg-white rounded border overflow-hidden relative">
                          <Image
                            src={item.product.images?.[0] || "/placeholder.png"}
                            fill
                            alt="Product"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} unidades x ${item.price}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">${item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-medium">Total Pagado</span>
                    <span className="text-2xl font-bold text-primary">${selectedSale.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* --- SECCIÓN 3: NOTAS --- */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>Observaciones</CardTitle>
            <CardDescription>
              Información adicional para el equipo de despacho o contabilidad.
            </CardDescription>
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
                        placeholder="Escribe aquí cualquier detalle importante..."
                        className="min-h-[100px] resize-none"
                      />
                    ) : (
                      <div className="p-4 rounded-md bg-muted/30 border text-sm italic">
                        {field.value || "Sin observaciones."}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* --- SECCIÓN 4 (FINAL): PUBLICAR / GUARDAR --- */}
        <Card className="border-2 border-primary/20 shadow-md bg-muted/10">
          <CardHeader className="pb-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary text-primary-foreground rounded-full">
                {isNew ? <CreditCard className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
              </div>
              <CardTitle>{isNew ? "Finalizar Venta" : "Actualizar Estado"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 bg-background">
            {/* CAMPOS DE ESTADO (SOLO EDICIÓN) */}
            {!isNew && (
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del Pedido</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="PREPARING">En Preparación</SelectItem>
                          <SelectItem value="SHIPPED">Enviado</SelectItem>
                          <SelectItem value="DELIVERED">Entregado</SelectItem>
                          <SelectItem value="CANCELLED">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("status") === "SHIPPED" && (
                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Seguimiento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej: MX-99887766" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* CAMPOS DE PAGO (SOLO NUEVO) */}
            {isNew && (
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Método de Pago</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                        <SelectItem value="TARJETA">Tarjeta de Crédito/Débito</SelectItem>
                        <SelectItem value="TRANSFERENCIA">Transferencia Bancaria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator className="my-4" />

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg h-12 shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}

              {isSubmitting ? "Procesando..." : isNew ? "Confirmar Venta" : "Guardar Cambios"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
