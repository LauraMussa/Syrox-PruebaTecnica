import * as XLSX from "xlsx";

import { Sale } from "@/types/sale.types"; 

interface ExportOptions {
  filename?: string;
  sheetName?: string;
}


export function exportSalesToExcel(
  sales: Sale[],
  options: ExportOptions = {}
) {
  const {
    filename = `ventas_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName = "Ventas",
  } = options;

  const data = sales.map((sale) => {
    const totalItems = sale.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
    
    const productsSummary = sale.items?.map((item: any) => 
      `${item.product?.name || 'Producto'} (x${item.quantity})`
    ).join(", ") || "-";

    return {
      "ID Pedido": sale.orderNumber || sale.id.slice(0, 8), 
      "Fecha": new Date(sale.createdAt).toLocaleDateString("es-ES"),
      "Cliente": sale.customer?.name || "Cliente Eliminado",
      "Email Cliente": sale.customer?.email || "-",
      "Estado": traducirEstado(sale.status), 
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

  const columnWidths = [
    { wch: 15 }, 
    { wch: 12 }, 
    { wch: 25 }, 
    { wch: 25 },
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 50 }, 
    { wch: 10 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 30 }, 
  ];
  ws["!cols"] = columnWidths;

  XLSX.writeFile(wb, filename);
}

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
