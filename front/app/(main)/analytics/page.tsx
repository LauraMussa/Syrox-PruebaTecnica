"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSales } from "@/store/sales/salesSlice"; // Ajusta según tu slice

import { StatsCards } from "@/components/analytics/StatsCards";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { SalesPieChart } from "@/components/analytics/SalesPieChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // Si tuvieras picker
import { AnalyticsSkeleton } from "@/components/skeletons/analytics/AnalyticsSkeleton";
import { calculateAnalytics } from "@/helpers/analytics";
import { exportAnalyticsToExcel } from "@/lib/exports/analytics.export";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const { items: sales, loadingSales } = useAppSelector((state) => state.sales);

  const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    // Cargar ventas si no están cargadas
    if (sales.length === 0) {
      dispatch(fetchSales()); // Ajusta parámetros si es necesario
    }
  }, [dispatch, sales.length]);

  // Usamos useMemo para no recalcular en cada render
  const analyticsData = useMemo(() => calculateAnalytics(sales), [sales]);
  const handleExport = async () => {
    // Validamos que haya datos
    if (!analyticsData || sales.length === 0) {
      toast.warning("No hay datos para exportar.");
      return;
    }

    try {
      setIsExporting(true); // Activamos estado de carga

      // Llamamos a tu función mágica
      exportAnalyticsToExcel(analyticsData);

      toast.success("Reporte descargado exitosamente");
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Hubo un error al generar el Excel");
    } finally {
      // Pequeño delay para que se vea el feedback visual (opcional)
      setTimeout(() => setIsExporting(false), 500);
    }
  };
  if (loadingSales) return <AnalyticsSkeleton />;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center  space-x-2">
          <Label className="hidden md:flex mt-1">Diciembre 2025</Label>
          <Button size="sm" className="cursor-pointer" onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Generando..." : "Exportar Reporte"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <StatsCards
          data={{
            totalSales: analyticsData.totalSales,
            totalRevenue: analyticsData.totalRevenue,
            adminCommission: analyticsData.adminCommission,
            averageTicket: analyticsData.averageTicket,
          }}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RevenueChart data={analyticsData.revenueData} />

          <SalesPieChart data={analyticsData.pieData} />
        </div>
      </div>
    </div>
  );
}
