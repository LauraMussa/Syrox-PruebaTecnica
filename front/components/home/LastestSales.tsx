"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSales } from "@/store/sales/salesSlice";
import { Sale } from "@/types/sale.types";
import { useEffect } from "react";
import { History } from "lucide-react";

const formatCurrency = (value: number | string) => {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numberValue);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

function ListItem({ customerName, orderNumber, status, amount, date }: any) {
  return (
    <div className="flex justify-between items-center py-1 overflow-auto">
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-sm text-foreground leading-tight">{customerName}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span>Order #{orderNumber}</span>
          <span className="text-muted-foreground/50 mx-0.5">•</span>
          <span className="font-medium  text-[11px] tracking-wide text-foreground/80">Status: {status}</span>
        </p>
      </div>

      <div className="text-right flex flex-col items-end gap-0.5">
        <p className="font-bold text-sm text-green-700 dark:text-green-100/90">{amount}</p>
        <p className="text-[10px] text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

const LastestSales = () => {
  const { items } = useAppSelector((state: any) => state.sales);
  const sales = Array.isArray(items) ? items.slice(0, 5) : [];

  return (
    <Card className="h-full border border-transparent shadow-sm bg-card overflow-hidden flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row ">
        <History className="w-5 h-5 text-green-700 dark:text-green-200" />
        <CardTitle className="text-base font-bold text-foreground">Ventas Recientes</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {sales.map((s: Sale) => (
          <div
            key={s.id}
            className="border border-border rounded-xl p-3 bg-background hover:bg-accent/5 transition-colors shadow-sm"
          >
            <ListItem
              customerName={s.customer.name}
              orderNumber={s.orderNumber.split("-")[1] || s.orderNumber.slice(0, 8)}
              status={s.status}
              amount={formatCurrency(s.total)}
              date={formatDate(s.updatedAt)}
            />
          </div>
        ))}

        {sales.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-4">No hay ventas recientes</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LastestSales;
