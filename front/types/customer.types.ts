export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
    _count?: {
    sales: number;
  };
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;  
  address?: string; 
}