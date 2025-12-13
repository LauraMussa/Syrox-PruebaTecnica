"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addCategory,
  updateCategory,
  fetchParentCategories,
  fetchPagCategories,
  fetchCategoryTree,
} from "@/store/categories/categoriesSlice";
import { Category } from "@/types/category.types";

// UI Components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categorySchema } from "@/schemas/category.schema";
import { fetchHistory } from "@/store/history/historySlice";

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit?: Category | null;
}

export function CategoryFormModal({ open, onOpenChange, categoryToEdit }: Props) {
  const dispatch = useAppDispatch();
  const { parentCategories, tree } = useAppSelector((state: any) => state.categories);
  const isEditing = !!categoryToEdit;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      position: 1,
      parentId: null,
    },
  });

  const selectedParentId = watch("parentId");
  useEffect(() => {
    if (open) {
      dispatch(fetchCategoryTree());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (categoryToEdit || !open) return;

    let nextPos = 1;

    if (!selectedParentId || selectedParentId === "root") {
      if (tree.length > 0) {
        const max = Math.max(...tree.map((c: Category) => c.position || 0));
        nextPos = max + 1;
      }
    } else {
      const parent = tree.find((c: Category) => c.id === selectedParentId);

      if (parent && parent.children && parent.children.length > 0) {
        const max = Math.max(...parent.children.map((child: any) => child.position || 0));
        nextPos = max + 1;
      }
    }

    setValue("position", nextPos);
  }, [selectedParentId, tree, open, categoryToEdit, setValue]);

  useEffect(() => {
    if (open) {
      dispatch(fetchParentCategories());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open && categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        position: categoryToEdit.position,
        parentId: categoryToEdit.parentId || "root",
      });
    } else if (open && !categoryToEdit) {
      reset({ name: "", position: 1, parentId: "root" });
    }
  }, [open, categoryToEdit, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    const payload = {
      ...data,
      parentId: data.parentId === "root" || data.parentId === "" ? null : data.parentId,
    };

    try {
      if (isEditing && categoryToEdit) {
        await dispatch(updateCategory({ id: categoryToEdit.id, data: payload })).unwrap();
        toast.success("Categoría actualizada");
        dispatch(fetchHistory());
      } else {
        await dispatch(addCategory(payload as any)).unwrap();
        toast.success("Categoría creada");
        dispatch(fetchHistory());
      }
      dispatch(fetchParentCategories());
      dispatch(fetchPagCategories({ page: 1, limit: 10 }));
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err || "Error al guardar");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {Object.keys(errors).length > 0 && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm mb-4">
              <p className="font-semibold">Hay errores en el formulario:</p>
              <ul className="list-disc list-inside mt-1">
                {errors.name && <li>{errors.name.message}</li>}
                {errors.position && <li>{errors.position.message}</li>}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nombre de la categoría"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Categoría Padre</Label>
            <Select value={watch("parentId") || "root"} onValueChange={(val) => setValue("parentId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root" className="font-semibold text-primary">
                  Principal (sin padre)
                </SelectItem>
                {parentCategories.map(
                  (p: Category) =>
                    p.id !== categoryToEdit?.id && (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Posición Asignada</Label>
              <p className="text-xs text-muted-foreground">
                Se agregará automáticamente al final de la lista.
              </p>
            </div>

            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10 border border-primary/20">
              <span className="text-md font-bold text-primary">{watch("position")}</span>
            </div>

            <input type="hidden" {...register("position")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="cursor-pointer"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
