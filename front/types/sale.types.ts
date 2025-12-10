

import { Customer } from "./customer.types";

export interface ProductSummary {
  name: string;
  description: string;
  price: string;
}

export interface SaleItem {
  id: string;
  quantity: number;
  price: string; 
  product: ProductSummary;
}

export interface Sale {
  id: string;
  orderNumber: string;
  total: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "PREPARING";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: string;
  trackingId: string | null;
  customerId: string;
  shippingAddress: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  items: SaleItem[];
  customer: Customer;
}
