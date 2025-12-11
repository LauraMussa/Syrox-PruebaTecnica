import { Product } from "./product.types";
import { Customer } from "./customer.types";

export type OrderStatus = "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface SaleItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Sale {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
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
