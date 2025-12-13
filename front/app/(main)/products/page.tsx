"use client";
import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPagProducts,
  toggleProductStatus,
  deleteProduct,
  fetchProducts,
} from "@/store/products/productsSlice";
import { Product } from "@/types/product.types";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import Link from "next/link";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { ProductListSkeleton } from "@/components/skeletons/lists/ProductListSkeleton";
import { exportProductsToExcel } from "@/lib/exports/products.export";
import { fetchHistory } from "@/store/history/historySlice";

export default function ProductsListPage() {
  const dispatch = useAppDispatch();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { paginated } = useAppSelector((state: any) => state.products);

  const { items, meta, loading } = paginated;
  const start = (meta.page - 1) * 10 + 1;
  const end = Math.min(start + items.length - 1, meta.totalProducts);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPagProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.lastPage) {
      dispatch(fetchPagProducts({ page: newPage, limit: 10 }));
    }
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const filteredItems = items.filter((p: Product) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info("Obteniendo catálogo completo...");
      const allProducts = await dispatch(fetchProducts()).unwrap();

      if (!allProducts || allProducts.data.length === 0) {
        toast.warning("El catálogo está vacío");
        return;
      }
      exportProductsToExcel(allProducts.data);

      toast.success(`Reporte generado con ${allProducts.data.length} productos`);
    } catch (error) {
      console.error("Error exportando:", error);
      toast.error("Error al obtener los productos para el reporte");
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="cursor-pointer " variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Generando..." : "Descargar Reporte"}
          </Button>
          <Button className="cursor-pointer" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" /> Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos por nombre..."
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
            de <b>{meta.totalProducts}</b> productos
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Stock Total</TableHead>
              <TableHead>Editar Estado</TableHead>
              <TableHead className="text-right pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <ProductListSkeleton />
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 opacity-20" />
                    <p>No se encontraron productos.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((product: Product) => (
                <TableRow key={product.id} className="group">
                  <TableCell>
                    <div className="h-10 w-10 rounded bg-muted overflow-hidden border">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground bg-secondary">
                          Sin Foto
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{product.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.description}
                      </span>
                    </div>
                  </TableCell>

                  {/* Categoría */}
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {(product as any).category?.name || "Sin Categoría"}
                    </Badge>
                  </TableCell>
                  {/* Marca */}
                  <TableCell className="text-sm">{product.brand}</TableCell>

                  {/* Stock */}
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        product.stock > 10
                          ? "bg-blue-50 text-blue-800 dark:bg-green-900/30 dark:text-green-300"
                          : product.stock > 0
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {product.stock} unidades
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={async () => {
                          await dispatch(toggleProductStatus(product.id));
                          dispatch(fetchHistory());
                        }}
                        className="cursor-pointer dark:data-[state=checked]:bg-green-300/80 data-[state=checked]:bg-green-400 h-5 w-9"
                      />
                      <span
                        className={`text-xs font-medium ${
                          product.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                        }`}
                      >
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-5">
                    <div className="flex justify-end items-center gap-1">
                      <Link href={`/products/details/${product.id}`}>
                        <Button
                          variant="ghost"
                          className="cursor-pointer h-8 w-8 text-muted-foreground hover:bg-transparent  "
                          size="icon"
                        >
                          <Eye />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-aqua hover:bg-transparent  "
                        onClick={() => handleOpenEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-transparent  "
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="sm:max-w-[425px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                              <Trash2 className="h-5 w-5" /> Eliminar Producto
                            </AlertDialogTitle>
                            <AlertDialogDescription className="pt-2">
                              Estás a punto de eliminar <b>{product.name}</b> de la lista principal.
                              <br />
                              <br />
                              El producto se marcará como "Archivado" para mantener el historial de ventas,
                              pero no será visible en la tienda.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2 sm:gap-0">
                            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer border-none"
                              onClick={() => {
                                toast.promise(
                                  async () => {
                                    await dispatch(deleteProduct(product.id)).unwrap();
                                    dispatch(fetchHistory());
                                  },
                                  {
                                    loading: "Eliminando...",
                                    success: "Producto eliminado",
                                    error: "Error al eliminar",
                                  }
                                );
                              }}
                            >
                              Sí, eliminar
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
      <ProductFormModal open={isModalOpen} onOpenChange={setIsModalOpen} productToEdit={editingProduct} />
    </div>
  );
}
