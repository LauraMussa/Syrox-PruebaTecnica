import { Product } from "./product.types";
import { Customer } from "./customer.types";

export type OrderStatus = "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export interface ProductSummary {
  name: string;
  description: string;
  price: string | number;
  brand: string;
  category: {
    id: string;
    name: string;
    position: number;
    parentId: string | null;
  };
}

export interface SaleItem {
  id: string;
  quantity: number;
  price: number | string;
  product: ProductSummary;
}

export interface Sale {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number | string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  trackingId?: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  note?: string;

  items: SaleItem[];
}

export interface CreateSaleDto {
  customerId: string;
  items: { productId: string; quantity: number }[];
  paymentMethod: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  note?: string;
}

export interface UpdateSaleStatusDto {
  id: string;
  status: OrderStatus;
  trackingId?: string;
  note?: string;
}
