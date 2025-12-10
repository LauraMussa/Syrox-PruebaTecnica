import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Sale } from "@/types/sale.types";
import { getAllSalesService } from "@/services/sales.service";
import { getBestSellersService } from "@/services/products.service";
import { BestSellerProduct } from "@/types/product.types";

/// FETCH
export const fetchSales = createAsyncThunk<Sale[]>("sales/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllSalesService();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchBestSellers = createAsyncThunk<BestSellerProduct[]>(
  "sales/fetchBestSellers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBestSellersService();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/// TYPES
interface SalesState {
  items: Sale[];
  bestSellers: BestSellerProduct[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/// INITIAL STATE
const initialState: SalesState = {
  items: [],
  bestSellers: [],
  status: "idle",
  error: null,
};

/// SLICE
const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Sales
      .addCase(fetchSales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchBestSellers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default salesSlice.reducer;
