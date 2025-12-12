const API_URL = process.env.NEXT_PUBLIC_API;
import { getAuthHeaders } from "@/helpers/api-helper";
import { CreateSaleDto, OrderStatus, Sale, UpdateSaleStatusDto } from "@/types/sale.types";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error en la petición");
  }
  return response.json();
};

interface PaginatedSalesResponse {
  data: Sale[];
  meta: {
    totalSales: number;
    lastPage: number;
    page: number;
  };
}
export const getAllSalesService = async (): Promise<Sale[]> => {
  try {
    const response = await fetch(`${API_URL}/sales`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error getAllSales:", error);
    throw error;
  }
};

export const getAllSalesPaginatedService = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedSalesResponse> => {
  try {
    const response = await fetch(`${API_URL}/sales?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error getAllSalesPaginated:", error);
    throw error;
  }
};

export const getSaleByIdService = async (id: string): Promise<Sale> => {
  try {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const createSaleService = async (data: CreateSaleDto): Promise<Sale> => {
  try {
    const response = await fetch(`${API_URL}/sales`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateSaleStatusService = async (id: string, dto: UpdateSaleStatusDto): Promise<Sale> => {
  try {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: dto.status,
        trackingId: dto.trackingId || "",
        note: dto.note,
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};
