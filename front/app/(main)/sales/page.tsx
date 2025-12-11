"use client";
import { useEffect, useState } from "react";
import { Edit, Eye, Search, Plus } from "lucide-react";
import Link from "next/link";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPagSales } from "@/store/sales/salesSlice";
import { Sale } from "@/types/sale.types";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { PaginationControls } from "@/components/ui/pagination-controls";
import { SalesListSkeleton } from "@/components/skeletons/lists/SalesListSkeleton";
import { CreateSaleModal } from "@/components/sales/CreateSaleModal";
import { UpdateSaleModal } from "@/components/sales/UpdateSaleModal";
import { useRouter } from "next/navigation";

// Helpers visuales
const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700 border-green-200";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    case "PREPARING":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getPaymentColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-black text-white hover:bg-black/90";
    case "FAILED":
      return "bg-red-600 text-white hover:bg-red-700";
    case "REFUNDED":
      return "bg-orange-500 text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
};

export default function SalesListPage() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Usamos el slice de ventas
  const { paginated } = useAppSelector((state: any) => state.sales);
  const { items, meta, loading } = paginated;
  const router = useRouter();
  const safeMeta = meta || { page: 1, lastPage: 1, totalSales: 0 };
  useEffect(() => {
    dispatch(fetchPagSales({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.lastPage) {
      dispatch(fetchPagSales({ page: newPage, limit: 10 }));
    }
  };
  const handleEdit = (sale: Sale) => {
    setSaleToEdit(sale);
    router.push(`/sales/create-sale/${sale.id}`);
    // setIsUpdateModalOpen(true);
  };
  const filteredItems = items.filter(
    (s: Sale) =>
      s.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
        {/* <Link href={`/sales/create-sale/${sale.id}`}></Link> */}
        <Button className="cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Pedido
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, orden..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20">
          <p className="font-semibold text-sm">Listado de Ventas</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Cliente</TableHead>
              <TableHead>Número de Orden</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Pago</TableHead>
              <TableHead className="text-right pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <SalesListSkeleton />
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No se encontraron ventas.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((sale: Sale) => (
                <TableRow key={sale.id} className="group hover:bg-muted/50 transition-colors">
                  {/* Columna Cliente */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border bg-muted">
                        <AvatarFallback className="font-bold text-xs">
                          {sale.customer.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{sale.customer.name}</span>
                        <span className="text-xs text-muted-foreground">{sale.customer.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Número de Orden */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-medium">{sale.orderNumber}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(sale.createdAt)}</span>
                    </div>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Badge variant="outline" className={`font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold">{formatCurrency(sale.total)}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {sale.paymentMethod.toLowerCase()}
                      </span>
                    </div>
                  </TableCell>

                  {/* Pago */}
                  <TableCell className="text-center">
                    <Badge className={`px-2 py-0.5 text-[10px] ${getPaymentColor(sale.paymentStatus)}`}>
                      {sale.paymentStatus}
                    </Badge>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="text-right pr-5">
                    <div className="flex justify-end items-center gap-1">
                      <Link href={`/sales/details/${sale.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/sales/create-sale/${sale.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* <UpdateSaleModal open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen} sale={saleToEdit} /> */}
        <CreateSaleModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
        <PaginationControls
          currentPage={safeMeta.page}
          lastPage={safeMeta.lastPage}
          totalItems={safeMeta.totalSales}
          itemName="ventas"
          isLoading={loading}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
