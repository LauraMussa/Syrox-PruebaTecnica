"use client";
import { useParams } from "next/navigation";
import { SaleForm } from "@/components/sales/SaleForm";

export default function UpdateSalePage() {
  const { id } = useParams();
  return <SaleForm saleId={id as string} />;
}