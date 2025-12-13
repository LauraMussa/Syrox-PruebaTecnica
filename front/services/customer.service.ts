import { CreateCustomerDto, Customer } from "@/types/customer.types";

const API_URL = process.env.NEXT_PUBLIC_API;

export const getAllCustomersService = async () => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Error obteniendo clientes");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createCustomerService = async (dto: any) => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error desconocido al crear cliente");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
