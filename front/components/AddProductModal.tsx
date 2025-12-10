"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";

import { productSchema, ProductFormValues } from "@/schemas/product.schema"; // Importa tu esquema

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { addProduct } from "@/store/products/productsSlice";

export function AddProductModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      isActive: true,
      gender: "Unisex",
      stock: 0,
      name: "",
      description: "",
      brand: "",
      categoryId: "",
      price: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Dispatch de la acción de Redux
      // Nota: Aquí deberías transformar 'data' para que coincida con lo que espera el thunk si faltan campos
      // Por ejemplo, options y images si no están en el formulario básico.

      const payload = {
        ...data,
        images: [], // Array vacío por ahora si no hay upload
        options: {}, // Objeto vacío por ahora
      };

      await dispatch(addProduct(payload as any)).unwrap(); // unwrap lanza error si falla el thunk

      setOpen(false);
      reset(); // Limpia el formulario
      // Aquí podrías mostrar un toast de éxito
    } catch (error) {
      console.error("Error al crear:", error);
      // Aquí podrías mostrar un toast de error
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className=" h-8 px-3 text-xs border-none cursor-pointer flex-1 sm:flex-none">
          <Plus className=" h-2 w-2 " />
          <p className="mt-[3px]">Añadir</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] bg-background text-card-foreground border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nuevo Producto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ingresa los detalles del producto para añadirlo al inventario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Fila 1: Nombre y Marca */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ej: Zapatillas Running"
                className="bg-background"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" {...register("brand")} placeholder="Ej: Nike" className="bg-background" />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
            </div>
          </div>

          {/* Fila 2: Categoría y Género */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              {/* Select de Shadcn requiere un manejo especial con setValue */}
              <Select onValueChange={(val) => setValue("categoryId", val)}>
                <SelectTrigger className="bg-background cursor-pointer">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {/* Aquí deberías iterar sobre tus categorías reales */}
                  <SelectItem value="1c6072b0-93af-486e-96ba-a3e4fb600384">Zapatillas</SelectItem>
                  <SelectItem value="cat-uuid-2">Accesorios</SelectItem>
                  <SelectItem value="cat-uuid-3">Indumentaria</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select onValueChange={(val) => setValue("gender", val as any)} defaultValue="Unisex">
                <SelectTrigger className="bg-background cursor-pointer">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hombre">Hombre</SelectItem>
                  <SelectItem value="Mujer">Mujer</SelectItem>
                  <SelectItem value="Niños">Niños</SelectItem>
                  <SelectItem value="Unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fila 3: Precio y Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  className="pl-7 bg-background"
                  placeholder="0.00"
                  {...register("price")}
                />
              </div>
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input
                id="stock"
                type="number"
                className="bg-background"
                placeholder="0"
                {...register("stock")}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Detalles del producto..."
              className="resize-none bg-background min-h-[80px]"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Switch Activo */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-background">
            <div className="space-y-0.5">
              <Label className="text-base">Producto Activo</Label>
              <p className="text-xs text-muted-foreground">
                Si está desactivado, no se mostrará en la tienda.
              </p>
            </div>
            <Switch className="cursor-pointer" checked={watch("isActive")} onCheckedChange={(val) => setValue("isActive", val)} />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar Producto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
