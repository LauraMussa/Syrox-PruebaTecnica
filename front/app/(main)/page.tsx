"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// Actions
import { fetchInventoryStats, fetchProducts } from "@/store/products/productsSlice";
import { fetchSales, fetchBestSellers } from "@/store/sales/salesSlice";

// Components
import InventoryCard from "@/components/home/InventoryCard";
import LastestSales from "@/components/home/LastestSales";
import BestSellers from "@/components/home/BestSellers";
import { HomeSkeleton } from "@/components/skeletons/home/HomeSkeleton";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { statsLoading, itemsLoading: productsLoading } = useAppSelector((state) => state.products);
  const { loadingSales, loadingBestSellers } = useAppSelector((state) => state.sales);

  const isGlobalLoading = 
    statsLoading || 
    productsLoading || 
    loadingSales || 
    loadingBestSellers;

  useEffect(() => {
    dispatch(fetchInventoryStats());
    dispatch(fetchProducts()); 
    dispatch(fetchSales());
    dispatch(fetchBestSellers());
  }, [dispatch]);

  if (isGlobalLoading) {
    return <HomeSkeleton />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <InventoryCard />
      <LastestSales />
      <BestSellers />
    </div>
  );
}
