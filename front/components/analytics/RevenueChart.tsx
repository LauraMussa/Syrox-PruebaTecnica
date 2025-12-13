"use client";

import { useMemo } from "react"; // Importamos useMemo para optimizar
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded-xl shadow-lg outline-none animate-in fade-in-0 zoom-in-95 z-50 ">
        <p className="text-sm font-medium text-muted-foreground  mb-1">{label}</p>
        <p className="text-xl font-bold text-primary ">
          ${new Intl.NumberFormat("es-AR").format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: Props) {
  
  const filledData = useMemo(() => {
    const allMonths = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    return allMonths.map((monthName) => {

      const found = data.find((d) => 
        d.name.toLowerCase().startsWith(monthName.toLowerCase())
      );

      return {
        name: monthName,
        total: found ? found.total : 0, // Si no hay datos, ponemos 0
      };
    });
  }, [data]);

  return (
    <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="px-3 ">
        <CardTitle>Resumen de Ingresos</CardTitle>
        <CardDescription>Comportamiento anual de ventas</CardDescription>
      </CardHeader>
      
      <CardContent className="pl-0 pr-4 pb-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={filledData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
            
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6496e5" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#84a9e0" stopOpacity={0.5} />
          {/*  */}
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(var(--border))" 
              opacity={0.4} 
            />

            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
              className="capitalize text-muted-foreground font-medium"
              interval={0} 
            />
            
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              className="text-muted-foreground font-medium "
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.1, radius: 4 }}
            />

            <Bar
              dataKey="total"
              fill="url(#colorTotal)"
              radius={[6, 6, 0, 0]}
              barSize={40}
              animationDuration={1500}
              minPointSize={2} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
