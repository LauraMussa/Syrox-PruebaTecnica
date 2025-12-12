import { getAuthHeaders } from "@/helpers/api-helper";
import {
  Category,
  ParentCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoryDto,
  PaginatedCategoriesResponse,
} from "@/types/category.types";

const API_URL = process.env.NEXT_PUBLIC_API;

// Helper para manejar errores de fetch
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error en la petición");
  }
  return response.json();
};

export const getAllCategoriesPaginatedService = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedCategoriesResponse> => {
  try {
    const response = await fetch(`${API_URL}/categories?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error getAllCategoriesPaginated:", error);
    throw error;
  }
};

export const getAllParentCategoriesService = async (): Promise<ParentCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/categories/parent`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error getAllParentCategories:", error);
    throw error;
  }
};

export const getCategoryTreeService = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories/tree`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error getCategoryTree:", error);
    throw error;
  }
};

export const addCategoryService = async (data: CreateCategoryDto): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error addCategory:", error);
    throw error;
  }
};

export const updateCategoryService = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updateCategory:", error);
    throw error;
  }
};

export const deleteCategoryService = async (id: string, force: boolean = false): Promise<void> => {
  try {
    const url = force ? `${API_URL}/categories/${id}?force=true` : `${API_URL}/categories/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error deleteCategory:", error);
    throw error;
  }
};

export const reorderCategoriesService = async (data: ReorderCategoryDto): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/categories/reorder`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error reorderCategories:", error);
    throw error;
  }
};
