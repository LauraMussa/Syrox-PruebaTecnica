import { ParentCategory } from "@/types/category.types";

const API_URL = process.env.NEXT_PUBLIC_API;
export const getAllParentCategoriesService = async (): Promise<ParentCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/categories/parent`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener categorias padre");
    }
    const data = await response.json();
    console.log("RESPUESTA DE CATEGORIAS PADRE", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
