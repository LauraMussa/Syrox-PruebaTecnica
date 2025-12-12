"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: any[];
}

export function RevenueChart({ data }: Props) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Resumen de Ingresos</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            {/* Grid sutil de fondo */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="capitalize"
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
            />
            {/* Color explícito hexadecimal para evitar problemas con variables CSS por ahora */}
            <Bar 
              dataKey="total" 
              fill="#2563eb"  
              radius={[4, 4, 0, 0]} 
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
