export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  brand: string;
  gender: string;
  isActive: boolean;
  options: {
    color?: string[];
    talla?: (string | number)[];
    [key: string]: any;
  };
  categoryId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    totalProducts: number;
    page: number;
    lastPage: number;
  };
}
export interface InventoryResponse {
  totalProducts: number;
  inventoryValue: number
}

export interface BestSellerProduct {
  id: string;
  name: string;
  price: string; 
  images: string[]; 
  totalSold: number;
}


export type CreateProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;