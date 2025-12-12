"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: {
    byBrand: { name: string; value: number }[];
    byCategory: { name: string; value: number }[];
  };
}

// Paleta de colores más variada y profesional
const COLORS = [
  "#2563eb", // Azul
  "#16a34a", // Verde
  "#e11d48", // Rojo/Rosa
  "#d97706", // Naranja
  "#7c3aed", // Violeta
  "#0891b2", // Cyan
  "#db2777", // Pink
];

export function SalesPieChart({ data }: Props) {
  // Estado para controlar qué "vista" mostrar
  const [viewMode, setViewMode] = useState<"brand" | "category">("category");

  // Elegir datos según el modo
  const currentData = viewMode === "brand" ? data.byBrand : data.byCategory;

  // Filtrar valores 0 para que no rompan el chart visualmente
  const chartData = currentData.filter((d) => d.value > 0);

  const getTitle = () => {
    if (viewMode === "brand") return "Ventas por Marca";
    if (viewMode === "category") return "Ventas por Categoría";
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{getTitle()}</CardTitle>
        <Select value={viewMode} onValueChange={(val: any) => setViewMode(val)}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Ver por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Categorías</SelectItem>
            <SelectItem value="brand">Marcas</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No hay datos suficientes
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
