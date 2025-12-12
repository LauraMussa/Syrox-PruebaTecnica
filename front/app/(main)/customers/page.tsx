"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCustomers } from "@/store/customers/customerSlice"; // Ajusta ruta
import { Customer } from "@/types/customer.types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Plus, Search, Users } from "lucide-react";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { CustomersGridSkeleton } from "@/components/skeletons/customers/CustomersGridSkeleton";
import { exportCustomersToExcel } from "@/lib/exports/customers.export";
import { toast } from "sonner";

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.customers);
  const loading = status === "loading" || status === "idle"; // Ajusta según tu slice
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchCustomers());
    }
  }, [dispatch, items.length]);

  // Filtrado local
  const filteredCustomers = items.filter(
    (c: Customer) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);

      // Si tienes filtrados, puedes exportar solo los filtrados o todos
      // Aquí exportamos TODOS los clientes
      exportCustomersToExcel(items, {
        filename: `clientes_${new Date().toLocaleDateString("es-ES")}.xlsx`,
        sheetName: "Clientes",
      });

      toast.success(`Descarga iniciada: ${items.length} clientes exportados`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al descargar el reporte");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <span className="text-sm text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>

        {/* Aquí podrías poner un modal para Crear Cliente si quisieras */}
        <Button
          onClick={handleExportExcel}
          disabled={isExporting || items.length === 0}
          variant="outline"
          className="gap-2 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Descargando..." : "Descargar Reporte"}
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Contenido */}
      {loading ? (
        <CustomersGridSkeleton />
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/10 border-dashed">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No se encontraron clientes</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Intenta con otra búsqueda" : "Agrega tu primer cliente"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}
