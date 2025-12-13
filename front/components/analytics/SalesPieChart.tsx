"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: {
    byBrand: { name: string; value: number }[];
    byCategory: { name: string; value: number }[];
  };
}

// PALETA DE COLORES "PRO" (Funciona en Dark y Light)
// Evitamos rojos/verdes puros. Usamos una gama fría y elegante.
const COLORS = [
  "#6496e5", // Blue 500 (Principal)
  "#8b5cf6", // Violet 500
  "#06b6d4", // Cyan 500
  "#10b981", // Emerald 500 (Para contraste suave)
  "#f43f5e", // Rose 500 (Solo un toque cálido)
  "#f59e0b", // Amber 500
  "#6366f1", // Indigo 500
];

// Tooltip personalizado (reutilizamos el estilo del otro gráfico)
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded-xl shadow-lg outline-none z-50">
        <div className="flex items-center gap-2 mb-1">
          {/* Circulito del color correspondiente */}
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <p className="text-sm font-medium text-muted-foreground">
            {payload[0].name}
          </p>
        </div>
        <p className="text-xl font-bold text-primary">
          ${new Intl.NumberFormat("es-AR").format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function SalesPieChart({ data }: Props) {
  const [viewMode, setViewMode] = useState<"brand" | "category">("category");

  const currentData = viewMode === "brand" ? data.byBrand : data.byCategory;
  
  const chartData = useMemo(() => {
    return currentData
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value); 
  }, [currentData]);

  return (
    <Card className="col-span-3 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-4 pt-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-bold">Distribución de Ventas</CardTitle>
          <CardDescription className="text-xs">
            {viewMode === "brand" ? "Por Marcas" : "Por Categorías"}
          </CardDescription>
        </div>
        
        <Select value={viewMode} onValueChange={(val: any) => setViewMode(val)}>
          <SelectTrigger className=" cursor-pointer w-[130px] h-8 text-xs bg-muted/50 border-muted-foreground/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Categorías</SelectItem>
            <SelectItem value="brand">Marcas</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70} 
                  outerRadius={95}
                  paddingAngle={3} 
                  dataKey="value"
                  stroke="none" 
                  cornerRadius={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ) )}
                </Pie>
                
                <Tooltip content={<CustomTooltip />} cursor={false} />
                
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingLeft: "20px" }} // Separación de la leyenda
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground font-medium ml-1 capitalize">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground/50 gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <span className="text-xl">Ø</span>
              </div>
              <span className="text-sm">Sin datos registrados</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
