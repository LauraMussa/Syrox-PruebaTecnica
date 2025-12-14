import * as XLSX from "xlsx";
import { calculateAnalytics } from "@/helpers/analytics";
import { Customer } from "@/types/customer.types";

type AnalyticsData = ReturnType<typeof calculateAnalytics>;

export function exportCustomersToExcel(
  customers: Customer[],
  options: { filename?: string; sheetName?: string } = {}
) {
  const { filename = `clientes_${new Date().toISOString().split("T")[0]}.xlsx`, sheetName = "Clientes" } =
    options;

  const data = customers.map((customer) => ({
    ID: customer.id,
    Nombre: customer.name,
    Email: customer.email,
    Teléfono: customer.phone || "-",
    Dirección: customer.address || "-",
    "Total Compras": customer._count?.sales || 0,
    "Fecha de Registro": new Date(customer.createdAt).toLocaleDateString("es-ES"),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  ws["!cols"] = [{ wch: 36 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 14 }, { wch: 15 }];

  XLSX.writeFile(wb, filename);
}

export function exportAnalyticsToExcel(
  analyticsData: AnalyticsData, //
  options: { filename?: string } = {}
) {
  const {
    filename = `reporte_analiticas_${new Date().toLocaleDateString("es-ES").replace(/\//g, "-")}.xlsx`,
  } = options;

  const wb = XLSX.utils.book_new();

  const summaryData = [
    { Métrica: "Ingresos Totales", Valor: analyticsData.totalRevenue },
    { Métrica: "Comisión Admin (15%)", Valor: analyticsData.adminCommission },
    { Métrica: "Ventas Totales", Valor: analyticsData.totalSales },
    { Métrica: "Ticket Promedio", Valor: analyticsData.averageTicket },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  wsSummary["!cols"] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen General");

  const monthlyData = analyticsData.revenueData.map((d) => ({
    Mes: d.name.toUpperCase(),
    Ingresos: d.total,
  }));
  const wsMonthly = XLSX.utils.json_to_sheet(monthlyData);
  wsMonthly["!cols"] = [{ wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsMonthly, "Ingresos por Mes");

  const categoryData = analyticsData.pieData.byCategory.map((d) => ({
    Categoría: d.name,
    Ventas: d.value,
  }));
  const wsCategory = XLSX.utils.json_to_sheet(categoryData);
  wsCategory["!cols"] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsCategory, "Por Categoría");

  const brandData = analyticsData.pieData.byBrand.map((d) => ({
    Marca: d.name,
    Ventas: d.value,
  }));
  const wsBrand = XLSX.utils.json_to_sheet(brandData);
  wsBrand["!cols"] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsBrand, "Por Marca");


  XLSX.writeFile(wb, filename);
}
