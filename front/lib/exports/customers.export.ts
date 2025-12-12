import * as XLSX from "xlsx";
import { Customer } from "@/types/customer.types";

interface ExportOptions {
  filename?: string;
  sheetName?: string;
}

/**
 * Exporta un array de clientes a Excel
 */
export function exportCustomersToExcel(
  customers: Customer[],
  options: ExportOptions = {}
) {
  const {
    filename = `clientes_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName = "Clientes",
  } = options;

  // Transformar datos para que sean más legibles en Excel
  const data = customers.map((customer) => ({
    ID: customer.id,
    Nombre: customer.name,
    Email: customer.email,
    Teléfono: customer.phone || "-",
    Dirección: customer.address || "-",
    "Total Compras": customer._count?.sales || 0,
    "Fecha de Registro": new Date(customer.createdAt).toLocaleDateString("es-ES"),
    "Última Actualización": new Date(customer.updatedAt).toLocaleDateString("es-ES"),
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const columnWidths = [
    { wch: 36 }, // ID
    { wch: 20 }, // Nombre
    { wch: 25 }, // Email
    { wch: 15 }, // Teléfono
    { wch: 30 }, // Dirección
    { wch: 14 }, // Total Compras
    { wch: 18 }, // Fecha de Registro
    { wch: 20 }, // Última Actualización
  ];
  ws["!cols"] = columnWidths;

  const headerRow = ws["!ref"];
  if (headerRow) {
    const range = XLSX.utils.decode_range(headerRow);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4472C4" } }, 
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }
  }

  XLSX.writeFile(wb, filename);
}
