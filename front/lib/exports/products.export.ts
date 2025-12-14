import * as XLSX from "xlsx";
import { Product } from "@/types/product.types"; 

interface ExportOptions {
  filename?: string;
  sheetName?: string;
}

export function exportProductsToExcel(
  products: Product[],
  options: ExportOptions = {}
) {
  const {
    filename = `productos_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName = "Productos",
  } = options;

  const data = products.map((product) => {
    const colores = product.options?.colores?.join(", ") || product.options?.color?.join(", ") || "-";
    const tallas = product.options?.tallas?.join(", ") || product.options?.talla?.join(", ") || "-";

    const categoria = (product as any).category?.name || "Sin Categoría";

    return {
      "ID": product.id.slice(0, 8),
      "Nombre": product.name,
      "Descripción": product.description || "-",
      "Marca": product.brand,
      "Categoría": categoria,
      "Precio ($)": Number(product.price), 
      "Stock": product.stock,
      "Colores Disp.": colores,
      "Tallas Disp.": tallas,
      "Estado": product.isActive ? "Activo" : "Inactivo",
      "Fecha Creación": new Date(product.createdAt || Date.now()).toLocaleDateString("es-ES"),
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Anchos de columna
  const columnWidths = [
    { wch: 10 }, // ID
    { wch: 30 }, // Nombre
    { wch: 40 }, // Descripción
    { wch: 15 }, // Marca
    { wch: 15 }, // Categoría
    { wch: 12 }, // Precio
    { wch: 8 },  // Stock
    { wch: 25 }, // Colores
    { wch: 20 }, // Tallas
    { wch: 10 }, // Estado
    { wch: 15 }, // Fecha
  ];
  ws["!cols"] = columnWidths;

  XLSX.writeFile(wb, filename);
}
