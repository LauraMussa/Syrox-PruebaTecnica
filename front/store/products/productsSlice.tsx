import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProductService,
  getAllProductsService,
  getIventoryStatsService,
} from "@/services/products.service";
import { CreateProductInput, Product } from "@/types/product.types";

///FETCH
export const fetchInventoryStats = createAsyncThunk(
  "products/fetchStats",
  async () => await getIventoryStatsService()
);

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => await getAllProductsService());

// POST
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (values: CreateProductInput, { rejectWithValue }) => {
    try {
      // Pasamos 'values' al servicio
      const response = await addProductService(values);
      return response; // Se asume que el backend devuelve el producto creado completo (con ID)
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al crear producto");
    }
  }
);

///TYPES
interface ProductsState {
  items: Product[];
  stats: {
    totalProducts: number;
    inventoryValue: number;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

///INITIAL STATE
const initialState: ProductsState = {
  items: [],
  stats: {
    totalProducts: 0,
    inventoryValue: 0,
  },
  status: "idle",
  error: null,
};

///SLICE
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.data;
      })
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
        state.stats.totalProducts += 1;
        state.stats.inventoryValue += Number(action.payload.price) * action.payload.stock;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
