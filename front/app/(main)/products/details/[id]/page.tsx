"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Componentes refactorizados
import { ProductHeader } from "@/components/products/details/ProductHeader";
import { ProductInfoCards } from "@/components/products/details/ProductInfoCards";
import { ProductSidebar } from "@/components/products/details/ProductSidebar";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductById } from "@/store/products/productsSlice";
import { DetailSkeleton } from "@/components/skeletons/details/ProductDetailSkeleton";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };

  const dispatch = useAppDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { selectedProduct, loading } = useAppSelector((state: any) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  if (loading) return <DetailSkeleton />;
  if (!selectedProduct) return null;

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen animate-in fade-in">
      <ProductHeader product={selectedProduct} onEdit={() => setIsEditModalOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductInfoCards product={selectedProduct} />
        <ProductSidebar product={selectedProduct} />
      </div>

      <ProductFormModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        productToEdit={selectedProduct}
      />
    </div>
  );
}
