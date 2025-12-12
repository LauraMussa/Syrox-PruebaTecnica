import * as XLSX from "xlsx";
// Asegúrate de importar tu tipo Sale correcto
import { Sale } from "@/types/sale.types"; 

interface ExportOptions {
  filename?: string;
  sheetName?: string;
}

/**
 * Exporta un array de VENTAS a Excel
 */
export function exportSalesToExcel(
  sales: Sale[],
  options: ExportOptions = {}
) {
  const {
    filename = `ventas_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName = "Ventas",
  } = options;

  // Transformar datos
  const data = sales.map((sale) => {
    // Calcular cantidad total de items para resumen
    const totalItems = sale.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
    
    // Formatear lista de productos en una sola celda (Ej: "Nike (x2), Adidas (x1)")
    const productsSummary = sale.items?.map((item: any) => 
      `${item.product?.name || 'Producto'} (x${item.quantity})`
    ).join(", ") || "-";

    return {
      "ID Pedido": sale.orderNumber || sale.id.slice(0, 8), // Usamos orderNumber si existe, sino ID corto
      "Fecha": new Date(sale.createdAt).toLocaleDateString("es-ES"),
      "Cliente": sale.customer?.name || "Cliente Eliminado",
      "Email Cliente": sale.customer?.email || "-",
      "Estado": traducirEstado(sale.status), // Función auxiliar opcional
      "Método Pago": sale.paymentMethod,
      "Productos": productsSummary,
      "Cant. Items": totalItems,
      "Total ($)": sale.total,
      "Tracking ID": sale.trackingId || "-",
      "Notas": sale.note || "-"
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Anchos de columna
  const columnWidths = [
    { wch: 15 }, // ID Pedido
    { wch: 12 }, // Fecha
    { wch: 25 }, // Cliente
    { wch: 25 }, // Email
    { wch: 15 }, // Estado
    { wch: 15 }, // Método Pago
    { wch: 50 }, // Productos (Ancho porque puede ser larga)
    { wch: 10 }, // Cant. Items
    { wch: 15 }, // Total
    { wch: 15 }, // Tracking
    { wch: 30 }, // Notas
  ];
  ws["!cols"] = columnWidths;

  XLSX.writeFile(wb, filename);
}

// Helper simple para traducir estados (opcional)
function traducirEstado(status: string) {
  const map: Record<string, string> = {
    PENDING: "Pendiente",
    PREPARING: "En Preparación",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado"
  };
  return map[status] || status;
}
