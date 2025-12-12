import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Plus, Trash, ShoppingBag, Package } from "lucide-react";
import Image from "next/image";
import { OptiontSelector } from "@/components/sales/OptionSelector"; // Asegúrate de que la ruta sea correcta
import { Product } from "@/types/product.types"; // O ajusta según tu tipo

interface SaleProductsSectionProps {
  products: Product[]; // O any[] si prefieres, pero Product[] es mejor
}

export function SaleProductsSection({ products }: SaleProductsSectionProps) {
  const form = useFormContext();

  // Extraemos los métodos del field array vinculados al formulario padre
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Lógica para manejar cambios de producto
  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    form.setValue(`items.${index}.productId`, productId);
    form.setValue(`items.${index}.maxStock`, product?.stock || 0);
    // Disparamos validación de cantidad y limpiamos errores viejos
    form.trigger(`items.${index}.quantity`);
    form.clearErrors(`items.${index}.productId`);
  };

  return (
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
            // Obtenemos el producto seleccionado actualmente para mostrar su imagen/opciones
            const currentProductId = form.watch(`items.${index}.productId`);
            const selectedProduct = products.find((p) => p.id === currentProductId);

            return (
              <div key={field.id} className="p-6 transition-colors hover:bg-muted/5">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Bloque Izquierdo: Imagen, Selector y Opciones */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      {/* Imagen del Producto */}
                      <div className="shrink-0">
                        <div className="relative w-18 h-18 rounded-lg border bg-white overflow-hidden shadow-sm h-[72px] w-[72px]">
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

                      {/* Selectores */}
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

                        {/* Selector de Variantes (Talle/Color) */}
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

                    {/* Mensaje de error específico para variantes */}
                    {/* {form.formState.errors.items?.[index]?.variantId && (
                      <p className="text-sm text-red-500 mt-0 md:ml-24">Debes seleccionar talle y color.</p>
                    )} */}
                  </div>

                  {/* Bloque Derecho: Cantidad y Eliminar */}
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
                      className="h-12 w-12 shrink-0 bg-transparent text-destructive/90 cursor-pointer hover:bg-transparent dark:hover:bg-transparent dark:bg-transparent hover:text-destructive border border-transparent hover:border-destructive/20"
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

        {/* Estado Vacío */}
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

        {form.formState.errors.items?.root?.message && (
          <p className="text-red-500 text-center p-4 text-sm font-medium bg-red-50 border-t border-red-100">
            {String(form.formState.errors.items.root.message)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
