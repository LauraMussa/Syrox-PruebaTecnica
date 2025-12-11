"use client";
import { useEffect, useState } from "react";
import { Edit, Trash2, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"; // Agregados iconos de flechas
import { toast } from "sonner";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPagCategories, deleteCategory } from "@/store/categories/categoriesSlice";
import { Category } from "@/types/category.types";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CategoryFormModal } from "@/components/categories/CategoryFormModal";
import { CategoryListSkeleton } from "@/components/skeletons/lists/CategoryListSkeleton";

export default function CategoriesListPage() {
  const dispatch = useAppDispatch();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { paginated } = useAppSelector((state: any) => state.categories);
  const { items, meta, loading } = paginated;
  const start = (meta.page - 1) * 10 + 1;
  const end = Math.min(start + items.length - 1, meta.totalCategories);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPagCategories({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.lastPage) {
      dispatch(fetchPagCategories({ page: newPage, limit: 10 }));
    }
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const filteredItems = items.filter((c: Category) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
        <Button className="cursor-pointer" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Mostrando{" "}
            <b>
              {start}-{end}
            </b>{" "}
            de <b>{meta.totalCategories}</b> categorías
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-20">Posición</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Subcategorías</TableHead>
              <TableHead>Categoría Padre</TableHead>
              <TableHead className="text-right pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <CategoryListSkeleton />
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No se encontraron categorías.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((category: Category) => (
                <TableRow key={category.id} className="group hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-sm font-medium">{category.position}</TableCell>
                  <TableCell className="font-semibold text-foreground">{category.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {category.children && category.children.length > 0
                      ? `${category.children.length} subcategorías`
                      : "0 subcategorías"}
                  </TableCell>
                  <TableCell>
                    {category.parent ? (
                      <Badge
                        variant="secondary"
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        {category.parent.name}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                        Principal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleOpenEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se eliminará <b>{category.name}</b>.
                              {category.children && category.children.length > 0 && (
                                <span className="block mt-2 text-destructive font-semibold">
                                  Cuidado! Esta categoría tiene subcategorías.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground cursor-pointer hover:bg-destructive/90"
                              onClick={() => {
                                toast.promise(dispatch(deleteCategory(category.id)).unwrap(), {
                                  loading: "Eliminando...",
                                  success: "Categoría eliminada",
                                  error: (err) => `Error: ${err}`,
                                });
                              }}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground hidden sm:block">
            Página {meta.page} de {meta.lastPage}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.lastPage || loading}
            >
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <CategoryFormModal open={isModalOpen} onOpenChange={setIsModalOpen} categoryToEdit={editingCategory} />
    </div>
  );
}
