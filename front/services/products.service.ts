
import { BestSellerProduct, CreateProductInput, InventoryResponse, Product, ProductsResponse } from "@/types/product.types";

const API_URL = process.env.NEXT_PUBLIC_API;

export const getIventoryStatsService = async (): Promise<InventoryResponse> => {
  try {
    const response = await fetch(`${API_URL}/dashboard/inventory-stats`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener estadisticas de producto");
    }
    const data = await response.json();
    console.log("RESPUESTA DE ESTADISTICAS DE PRODUCTO", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllProductsPagService = async (): Promise<ProductsResponse> => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener todos los productos");
    }
    const data = await response.json();
    console.log("RESPUESTA DE TODOS LOS PRODUCTOS PAGINADOS", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllProductsService = async (): Promise<ProductsResponse> => {
  try {
    const response = await fetch(`${API_URL}/dashboard/products`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener todos los productos");
    }
    const data = await response.json();
    console.log("RESPUESTA DE TODOS LOS PRODUCTOS", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBestSellersService = async (): Promise<BestSellerProduct[]> => {
  try {
    const response = await fetch(`${API_URL}/products/top-selling`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener productos mas vendidos");
    }
    const data = await response.json();
    console.log("RESPUESTA DE PRODUCTOS MAS VENDIDOS", data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addProductService = async (values: CreateProductInput) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al agregar producto");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
