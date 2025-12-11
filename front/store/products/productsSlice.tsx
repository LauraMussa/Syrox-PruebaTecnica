import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProductService,
  deleteProductService,
  getAllProductsPagService,
  getAllProductsService,
  getIventoryStatsService,
  getProductByIdService,
  updateProductService,
  updateProductStatusService,
} from "@/services/products.service";
import { CreateProductInput, Product } from "@/types/product.types";

///FETCH
export const fetchInventoryStats = createAsyncThunk(
  "products/fetchStats",
  async () => await getIventoryStatsService()
);

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => await getAllProductsService());

export const fetchPagProducts = createAsyncThunk(
  "products/fetchAllPag",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    return await getAllProductsPagService(page, limit);
  }
);

export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id: string) => {
  return await getProductByIdService(id);
});

// POST
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (values: CreateProductInput, { rejectWithValue }) => {
    try {
      const response = await addProductService(values);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al crear producto");
    }
  }
);

///DELETE
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteProductService(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al eliminar producto");
    }
  }
);

//PATCH
export const toggleProductStatus = createAsyncThunk(
  "products/toggleStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const updatedProduct = await updateProductStatusService(id);
      return updatedProduct;
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al cambiar estado");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: Partial<CreateProductInput> }, { rejectWithValue }) => {
    try {
      const updated = await updateProductService(id, data);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

///TYPES
interface ProductsState {
  items: Product[];
  paginated: {
    items: Product[];
    meta: {
      totalProducts: number;
      lastPage: number;
      page: number;
    };
    loading: boolean;
  };
  stats: {
    totalProducts: number;
    inventoryValue: number;
  };
  itemsLoading: boolean;
  statsLoading: boolean;
  selectedProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

///INITIAL STATE
const initialState: ProductsState = {
  items: [],
  paginated: {
    items: [],
    meta: {
      totalProducts: 0,
      lastPage: 1,
      page: 1,
    },
    loading: false,
  },
  stats: {
    totalProducts: 0,
    inventoryValue: 0,
  },
  selectedProduct: null,
  itemsLoading: false,
  statsLoading: false,
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
        state.statsLoading = false;
      })
      .addCase(fetchInventoryStats.pending, (state) => {
        state.statsLoading = true;
      });
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.data || action.payload;
        state.itemsLoading = false;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.itemsLoading = true;
      });

    ///fetch pag
    builder
      .addCase(fetchPagProducts.pending, (state) => {
        state.paginated.loading = true;
      })
      .addCase(fetchPagProducts.fulfilled, (state, action) => {
        state.paginated.loading = false;
        state.paginated.items = action.payload.data;
        state.paginated.meta = action.payload.meta;
      })
      .addCase(fetchPagProducts.rejected, (state, action) => {
        state.paginated.loading = false;
        state.error = action.error.message || "Error al cargar productos";
      });

    //fetch product by id
    builder
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload.data || action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
    // create Product
    builder
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
        if (state.paginated.meta.page === 1) {
          state.paginated.items.unshift(action.payload);
          if (state.paginated.items.length > 10) state.paginated.items.pop();
        }

        state.stats.totalProducts += 1;
        state.stats.inventoryValue += Number(action.payload.price) * action.payload.stock;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    /// actualizar estado isActive
    builder.addCase(toggleProductStatus.fulfilled, (state, action) => {
      const updatedProduct = action.payload;

      const indexPag = state.paginated.items.findIndex((p) => p.id === updatedProduct.id);
      if (indexPag !== -1) {
        state.paginated.items[indexPag].isActive = updatedProduct.isActive;
      }

      const indexAll = state.items.findIndex((p) => p.id === updatedProduct.id);
      if (indexAll !== -1) {
        state.items[indexAll].isActive = updatedProduct.isActive;
      }
    });
    //actualizar prodcuto
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.paginated.items.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.paginated.items[index] = updated;
      }
      const indexAll = state.items.findIndex((p) => p.id === updated.id);
      if (indexAll !== -1) {
        state.items[indexAll] = updated;
      }
      if (state.selectedProduct && state.selectedProduct.id === updated.id) {
        state.selectedProduct = updated;
      }
    });
    ///soft delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const idToDelete = action.payload;
        state.paginated.items = state.paginated.items.filter((p) => p.id !== idToDelete);
        state.items = state.items.filter((p) => p.id !== idToDelete);
        state.paginated.meta.totalProducts -= 1;
        state.stats.totalProducts -= 1;
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
