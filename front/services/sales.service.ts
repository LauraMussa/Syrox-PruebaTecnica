const API_URL = process.env.NEXT_PUBLIC_API;
import { Sale } from "@/types/sale.types";

export const getAllSalesService = async (): Promise<Sale[]> => {
  try {
    const response = await fetch(`${API_URL}/sales`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener las compras");
    }
    const data = await response.json();
    console.log("RESPUESTA DE TODAS LAS COMPRAS", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
