"use client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBestSellers } from "@/store/sales/salesSlice";
import { BestSellerProduct } from "@/types/product.types";
import { Package, Trophy } from "lucide-react";
import { BestSellersSkeleton } from "../skeletons/home/BestSellersSkeleton";

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(value));
};

const BestSellers = () => {
  const dispatch = useAppDispatch();
  const { bestSellers, loadingBestSellers } = useAppSelector((state: any) => state.sales);
  const isLoading = loadingBestSellers;
  useEffect(() => {
    if (!bestSellers || bestSellers.length === 0) {
      dispatch(fetchBestSellers());
    }
  }, [dispatch, bestSellers?.length]);

  const topProducts = Array.isArray(bestSellers) ? bestSellers.slice(0, 5) : [];

  if (isLoading) return <BestSellersSkeleton />;
  return (
    <Card className="h-full border border-transparent shadow-sm bg-card flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row ">
        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-200" />
        <CardTitle className="text-base font-bold text-foreground"> Más Vendidos</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {topProducts.map((product: BestSellerProduct, index: number) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 transition-colors border-b border-border last:border-0 last:pb-0"
          >
            <div className="h-10 w-10 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden border border-border">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <Package className="h-5 w-5 text-muted-foreground/50" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {" "}
              <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(product.price)}</p>
            </div>

            <div className="text-right">
              {index < 3 && (
                <p className="text-[10px] text-muted-foreground text-center mt-0.5">#{index + 1}</p>
              )}
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {product.totalSold} <span className="ml-1 text-[10px] font-normal opacity-80">ventas</span>
              </span>
            </div>
          </div>
        ))}

        {topProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center h-full">
            <Package className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Sin datos de ventas aún.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BestSellers;
