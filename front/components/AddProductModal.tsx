"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, X, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
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
import { ParentCategory } from "../types/category.types";
import { fetchParentCategories } from "@/store/categories/categoriesSlice";

export function AddProductModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { parentCategories } = useAppSelector((state: any) => state.categories);
  const [tempColor, setTempColor] = useState("");
  const [tempSize, setTempSize] = useState("");
  const [tempImage, setTempImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const currentImages = watch("images") || [];
  const currentOptions = watch("options") || { color: [], talla: [] };

  const handleAddColor = () => {
    if (!tempColor) return;
    const newColors = [...(currentOptions.color || []), tempColor];
    setValue("options", { ...currentOptions, color: newColors });
    setTempColor("");
  };

  const handleAddSize = () => {
    if (!tempSize) return;
    const newSizes = [...(currentOptions.talla || []), tempSize];
    setValue("options", { ...currentOptions, talla: newSizes });
    setTempSize("");
  };

  const handleAddImage = () => {
    if (!tempImage) return;
    const newImages = [...currentImages, tempImage];
    setValue("images", newImages);
    setTempImage("");
  };

  const removeColor = (idx: number) => {
    const newColors = currentOptions.color?.filter((_, i) => i !== idx);
    setValue("options", { ...currentOptions, color: newColors });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Subiendo imagen...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "syrox_tech"); // TU PRESET DE CLOUDINARY
      formData.append("folder", "syroxtech/productos");

      // 2. Petición a Cloudinary (O a tu endpoint que sube a Cloudinary)
      const res = await fetch("https://api.cloudinary.com/v1_1/dvgnwrkvl/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        const currentImages = watch("images") || [];
        setValue("images", [...currentImages, data.secure_url]);

        toast.success("Imagen subida", { id: loadingToast });
      } else {
        throw new Error("No se recibió URL");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al subir imagen", { id: loadingToast });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!parentCategories || parentCategories.length === 0) {
      dispatch(fetchParentCategories());
    }
  }, [dispatch, parentCategories?.length]);

  const onSubmit = async (data: ProductFormValues) => {
    const payload = { ...data, images: [], options: {} };
    const crearProductoPromise = dispatch(addProduct(payload as any)).unwrap();

    toast.promise(crearProductoPromise, {
      loading: "Creando producto...",
      success: (data) => {
        setOpen(false);
        reset();
        return `Producto "${payload.name}" creado con éxito!`;
      },
      error: (err) => {
        console.error("Error al crear:", err);
        return `Error al crear: ${err.message || "Intentalo de nuevo"}`;
      },
    });
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              {/* Select de Shadcn requiere un manejo especial con setValue */}
              <Select onValueChange={(val) => setValue("categoryId", val)}>
                <SelectTrigger className="bg-background cursor-pointer">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories?.map((p: ParentCategory) => {
                    return <SelectItem value={p.id}>{p.name}</SelectItem>;
                  })}
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
                  {...register("price", { valueAsNumber: true })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
            {/* Colores */}
            <div className="space-y-2">
              <Label>Colores</Label>
              <div className="flex gap-2">
                <Input
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddColor())}
                  placeholder="Escribí y enter..."
                />
                <Button type="button" onClick={handleAddColor} size="icon" variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {/* Lista de colores cargados en el form */}
              <div className="flex flex-wrap gap-2 mt-2">
                {currentOptions.color?.map((c: string, i: number) => (
                  <div key={i} className="bg-muted px-2 py-1 rounded text-xs flex items-center gap-1">
                    {c} <X className="w-3 h-3 cursor-pointer" onClick={() => removeColor(i)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Talles */}
            <div className="space-y-2">
              <Label>Talles</Label>
              <div className="flex gap-2">
                <Input
                  value={tempSize}
                  onChange={(e) => setTempSize(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize())}
                  placeholder="Escribí y enter..."
                />
                <Button type="button" onClick={handleAddSize} size="icon" variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentOptions.talla?.map((t: string | number, i: number) => (
                  <div key={i} className="bg-muted px-2 py-1 rounded text-xs flex items-center gap-1">
                    {t}
                    {/* Acá podés hacer la función removeSize similar a removeColor */}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        const newSizes = currentOptions.talla?.filter((_, idx) => idx !== i);
                        setValue("options", { ...currentOptions, talla: newSizes });
                      }}
                    />
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
              {watch("images")?.map((url, i) => (
                <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                  <img src={url} alt="Producto" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const newImgs = watch("images").filter((_, idx) => idx !== i);
                      setValue("images", newImgs);
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

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
            <Switch
              className="cursor-pointer"
              checked={watch("isActive")}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
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
