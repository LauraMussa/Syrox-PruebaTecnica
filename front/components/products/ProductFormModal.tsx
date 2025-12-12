"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, X, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { productSchema, ProductFormValues } from "@/schemas/product.schema";
import { Product } from "@/types/product.types";

// Actions
import { addProduct, updateProduct } from "@/store/products/productsSlice";
import { fetchParentCategories } from "@/store/categories/categoriesSlice";

// Hooks
import { useProductHandlers } from "@/hooks/useProductHandlers";

// UI Components
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
import { ParentCategory } from "@/types/category.types";

interface ProductFormModalProps {
  productToEdit?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProductFormModal({
  productToEdit,
  open: controlledOpen,
  onOpenChange,
}: ProductFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const dispatch = useAppDispatch();
  const { parentCategories } = useAppSelector((state: any) => state.categories);

  const isEditing = !!productToEdit;

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
      price: 0,
      images: [],
      options: { color: [], talla: [] },
    },
  });

  const {
    tempColor,
    setTempColor,
    tempSize,
    setTempSize,
    fileInputRef,
    handleAddColor,
    handleRemoveColor,
    handleAddSize,
    handleRemoveSize,
    handleFileUpload,
    handleRemoveImage,
    currentOptions,
    currentImages,
  } = useProductHandlers(setValue, watch);

  useEffect(() => {
    if ((!parentCategories || parentCategories.length === 0) && isOpen) {
      dispatch(fetchParentCategories());
    }
  }, [dispatch, parentCategories?.length, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        reset({
          name: productToEdit.name,
          description: productToEdit.description || "",
          price: Number(productToEdit.price),
          stock: productToEdit.stock,
          brand: productToEdit.brand || "",
          gender: (productToEdit.gender as any) || "Unisex",
          categoryId: (productToEdit as any).categoryId || "",
          isActive: productToEdit.isActive,
          images: productToEdit.images || [],
          options: {
            color: (productToEdit.options as any)?.color || [],
            talla: (productToEdit.options as any)?.talla || [],
          },
        });
      } else {
        reset({
          isActive: true,
          gender: "Unisex",
          stock: 0,
          name: "",
          description: "",
          brand: "",
          categoryId: "",
          price: 0,
          images: [],
          options: { color: [], talla: [] },
        });
      }
    }
  }, [isOpen, productToEdit, reset]);

  const onSubmit = async (data: ProductFormValues) => {
    const payload = { ...data };
    try {
      if (isEditing && productToEdit) {
        await dispatch(updateProduct({ id: productToEdit.id, data: payload as any })).unwrap();
        toast.success(`Producto "${payload.name}" actualizado correctamente!`);
      } else {
        await dispatch(addProduct(payload as any)).unwrap();
        toast.success(`Producto "${payload.name}" creado con éxito!`);
      }
      setOpen(false);
      if (!isEditing) reset();
    } catch (err: any) {
      console.error("Error al guardar:", err);
      toast.error(`Error: ${err.message || "Intentalo de nuevo"}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button className="h-8 px-3 text-xs border-none cursor-pointer flex-1 sm:flex-none">
            <Plus className="h-2 w-2 mr-1" />
            <span className="mt-px">Añadir</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[1300px] w-[95vw] max-h-[90vh] overflow-y-auto bg-background text-card-foreground border-border [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? `Modifica los detalles de ${productToEdit?.name}.`
              : "Ingresa los detalles del producto para añadirlo al inventario."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {Object.keys(errors).length > 0 && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold">Hay errores en el formulario:</p>
              <ul className="list-disc list-inside mt-1">
                {errors.name && <li>{errors.name.message}</li>}
                {errors.price && <li>{errors.price.message}</li>}
                {errors.categoryId && <li>Categoría es requerida</li>}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
              >
                <SelectTrigger className="bg-background cursor-pointer">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories?.map((p: ParentCategory) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                value={watch("gender") as any}
                onValueChange={(val) => setValue("gender", val as any)}
                defaultValue="Unisex"
              >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  className="pl-7 bg-background"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input
                id="stock"
                type="number"
                className="bg-background"
                placeholder="0"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
            <div className="space-y-2">
              <Label>Colores</Label>
              <div className="flex gap-2">
                <Input
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddColor())}
                  placeholder="Escribí y enter..."
                />
                <Button
                  className="cursor-pointer"
                  type="button"
                  onClick={handleAddColor}
                  size="icon"
                  variant="secondary"
                >
                  <Plus className="w-4 h-4 " />
                </Button>
              </div>
              {errors.options?.color?.message && (
                <p className="text-xs text-destructive">{errors.options?.color?.message}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {currentOptions.color?.map((c: string, i: number) => (
                  <div key={i} className="bg-muted px-2 py-1 rounded text-xs flex items-center gap-1">
                    {c} <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveColor(i)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Talles</Label>
              <div className="flex gap-2">
                <Input
                  value={tempSize}
                  onChange={(e) => setTempSize(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize())}
                  placeholder="Escribí y enter..."
                />
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={handleAddSize}
                  size="icon"
                  variant="secondary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
                {errors.options?.talla?.message && (
                <p className="text-xs text-destructive">{errors.options?.talla?.message}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {currentOptions.talla?.map((t: string | number, i: number) => (
                  <div key={i} className="bg-muted px-2 py-1 rounded text-xs flex items-center gap-1">
                    {t}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSize(i)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label>Imágenes</Label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex flex-wrap gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Subir</span>
              </div>
              {currentImages.map((url, i) => (
                <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                  <img src={url} alt={`Prod-${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && <p className="text-xs text-destructive">{errors.images.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Detalles del producto..."
              className="resize-none bg-background min-h-20"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-background">
            <div className="space-y-0.5">
              <Label className="text-base">Producto Activo</Label>
              <p className="text-xs text-muted-foreground">
                Si está desactivado, no se mostrará en la tienda.
              </p>
            </div>
            <Switch
              className="cursor-pointer"
              checked={watch("isActive")}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            {!isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                className="mr-auto cursor-pointer hover:text-background text-background dark:hover:bg-destructive bg-destructive/90 hover:bg-destructive"
              >
                Limpiar
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {isEditing ? "Guardando..." : "Creando..."}
                </>
              ) : isEditing ? (
                "Guardar Cambios"
              ) : (
                "Crear Producto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
