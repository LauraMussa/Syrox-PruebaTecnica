import { Sale } from "@/types/sale.types";

export const calculateAnalytics = (sales: Sale[]) => {
  let totalRevenue = 0;
  
  // Maps para acumular totales por grupo
  const monthlyDataMap: Record<string, number> = {};
  const brandMap: Record<string, number> = {};
  const categoryMap: Record<string, number> = {};
  const productMap: Record<string, number> = {};

  sales.forEach((sale) => {
    // 1. Calcular el total real de ESTA venta sumando sus items
    const currentSaleTotal = sale.items.reduce((sum, item) => {
      // Forzamos conversión a Number por si el backend manda strings ("45000")
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const itemTotal = price * quantity;

      // --- Llenar datos de Torta (Pie Chart) ---
      
      // A) Marca: Viene directa como string (Ej: "Vizzano")
      const brand = item.product.brand || "Sin Marca";
      
      // B) Categoría: Viene como objeto (Ej: { name: "Últimos Pares" })
      const category = item.product.category?.name || "Sin Categoría";
      
      // C) Producto: Nombre directo
      const productName = item.product.name || "Desconocido";

      // Acumulamos el valor monetario
      brandMap[brand] = (brandMap[brand] || 0) + itemTotal;
      categoryMap[category] = (categoryMap[category] || 0) + itemTotal;
      productMap[productName] = (productMap[productName] || 0) + itemTotal;

      return sum + itemTotal;
    }, 0);

    // 2. Acumular al Revenue Global
    totalRevenue += currentSaleTotal;

    // 3. Llenar datos por Mes (Bar Chart)
    const date = new Date(sale.createdAt);
    // 'short' devuelve "dic", "ene", etc. según el locale
    const month = date.toLocaleString('es-ES', { month: 'short' }); 
    
    // Sumamos al mes correspondiente
    monthlyDataMap[month] = (monthlyDataMap[month] || 0) + currentSaleTotal;
  });

  // --- Transformar Maps a Arrays para Recharts ---

  // Bar Chart Data (Ingresos por mes)
  const revenueData = Object.entries(monthlyDataMap).map(([name, total]) => ({
    name, // ej: "dic"
    total // ej: 150000
  }));

  const toChartData = (map: Record<string, number>) => 
    Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); 

  const totalSales = sales.length;
  const adminCommission = totalRevenue * 0.15;
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  return {
    totalSales,
    totalRevenue,
    adminCommission,
    averageTicket,
    revenueData, 
    pieData: {  
      byBrand: toChartData(brandMap),
      byCategory: toChartData(categoryMap),
    }
  };
};
