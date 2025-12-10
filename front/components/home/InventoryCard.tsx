"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Package, Plus } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Product } from "@/types/product.types"; 
import Link from "next/link";
import { fetchInventoryStats, fetchProducts } from "@/store/products/productsSlice";
import { AddProductModal } from "../AddProductModal";

const InventoryCard = () => {
  const dispatch = useAppDispatch();
  const { stats, items } = useAppSelector((state: any) => state.products);

  const products = Array.isArray(items) ? items.slice(0, 15) : [];

  useEffect(() => {
    if (stats.totalProducts === 0) {
      dispatch(fetchInventoryStats());
    }
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, stats.totalProducts, items.length]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="h-full flex border border-transparent flex-col shadow-sm bg-card overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between ">
        <div className="flex  gap-2">
          <Package className="w-5 h-5 text-blue-800 dark:text-blue-300" />
          <CardTitle className="text-base font-semibold text-foreground">Inventario</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <div>
          <h2 className="text-4xl font-bold text-foreground">{stats?.totalProducts || 0}</h2>
          <p className="text-xs text-muted-foreground">Productos en inventario</p>
          <p className="text-sm font-semibold text-primary mt-1 truncate">
            Valor: {formatCurrency(stats?.inventoryValue || 0)}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="flex flex-col gap-1">
            {products.map((i: Product) => (
              <div
                key={i.id}
                className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0"
              >
                <span className="text-foreground truncate max-w-[70%]">{i.name}</span>
                <span className="text-muted-foreground whitespace-nowrap text-xs">{i.stock} uds.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-5 sm:gap-2 mt-auto pt-2">
         <AddProductModal />
          {/* <Button className=" h-8 px-3 text-xs border-none cursor-pointer flex-1 sm:flex-none">
            <Plus className=" h-2 w-2 " />
            <p className="mt-[3px]">Añadir</p>
          </Button> */}
          <Link
            href={"/products"}
            className="cursor-pointer border-none hover:bg-accent h-8 items-center justify-center flex p-4 py-4.2 bg-accent/70 rounded-sm text-xs ml-auto"
          >
            Ver Todos
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCard;
