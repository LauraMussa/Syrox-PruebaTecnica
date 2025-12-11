"use client";

import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks"; // Tu hook de redux
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { OrderStatus } from "../types/sale.types";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Inicio",
  "/products": "Productos",
  "/sales": "Ventas",
  "/categories": "Categorías",
  "/customers": "Clientes",
  "/analytics": "Analíticas",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const { selectedProduct } = useAppSelector((state: any) => state.products);
  const { selectedSale } = useAppSelector((state: any) => state.sales);
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = segments
    .map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      let label = ROUTE_LABELS[href] || segment;

      const isProductDetail = segments[index - 1] === "details" && segments[index - 2] === "products";
      const isSaleDetail = segments[index - 1] === "details" && segments[index - 2] === "sales";

      if (isProductDetail) {
        if (selectedProduct && selectedProduct.id === segment) {
          label = selectedProduct.name;
        } else {
          label = "Cargando...";
        }
      } else if (label === "details") {
        return null;
      }

      if (isSaleDetail) {
        if (selectedSale && selectedSale.id === segment) {
          label = `Orden #${selectedSale.orderNumber}`;
        } else {
          label = "Cargando...";
        }
      } else if (label === "details") {
        return null;
      }

      const isLast = index === segments.length - 1;

      return { href, label, isLast };
    })
    .filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}

        {breadcrumbItems.map((item: any, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {!item.isLast ? (
                <BreadcrumbLink href={item.href} className="capitalize">
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="capitalize">{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
