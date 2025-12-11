import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Sale, OrderStatus, CreateSaleDto, UpdateSaleStatusDto } from "@/types/sale.types";
import {
  getAllSalesPaginatedService, // Usarás este para la lista completa
  getAllSalesService, // Usarás este para el dashboard (Latest Sales)
  createSaleService,
  updateSaleStatusService,
  getSaleByIdService,
} from "@/services/sales.service";
import { getBestSellersService } from "@/services/products.service";
import { BestSellerProduct } from "@/types/product.types";

///FETCH
export const fetchPagSales = createAsyncThunk(
  "sales/fetchPag",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await getAllSalesPaginatedService(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSales = createAsyncThunk("sales/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await getAllSalesService();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchSaleById = createAsyncThunk("sales/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    return await getSaleByIdService(id);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// CREATE
export const createSale = createAsyncThunk(
  "sales/create",
  async (data: CreateSaleDto, { rejectWithValue }) => {
    try {
      return await createSaleService(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// /UPDATE
export const updateSaleStatus = createAsyncThunk(
  "sales/updateStatus",
  async (dto: UpdateSaleStatusDto, { rejectWithValue }) => {
    try {
      const { id, ...rest } = dto;

      return await updateSaleStatusService(id, dto);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Best Sellers
export const fetchBestSellers = createAsyncThunk("sales/fetchBestSellers", async (_, { rejectWithValue }) => {
  try {
    return await getBestSellersService();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// --- STATE ---

interface SalesState {
  paginated: {
    items: Sale[];
    meta: {
      totalSales: number;
      lastPage: number;
      page: number;
    };
    loading: boolean;
  };
  selectedSale: Sale | null;
  items: Sale[];
  loadingSales: boolean;
  loadingSelected: boolean;
  bestSellers: BestSellerProduct[];
  loadingBestSellers: boolean;

  error: string | null;
}

const initialState: SalesState = {
  paginated: {
    items: [],
    meta: {
      totalSales: 0,
      lastPage: 1,
      page: 1,
    },
    loading: false,
  },
  selectedSale: null,
  loadingSelected: false,
  items: [],
  loadingSales: false,
  bestSellers: [],
  loadingBestSellers: false,
  error: null,
};

///SLICE 
const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    resetSelectedSale: (state) => {
      state.selectedSale = null;
      state.loadingSelected = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //FETCH PAGINADO
    builder
      .addCase(fetchPagSales.pending, (state) => {
        state.paginated.loading = true;
        state.error = null;
      })
      .addCase(fetchPagSales.fulfilled, (state, action) => {
        state.paginated.loading = false;
        state.paginated.items = action.payload.data || [];
        state.paginated.meta = action.payload.meta;
      })
      .addCase(fetchPagSales.rejected, (state, action) => {
        state.paginated.loading = false;
        state.error = action.payload as string;
      });

    //FETCH SIMPLE (dashboard)
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loadingSales = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loadingSales = false;
        const payload = action.payload as any;
        const cleanSales = Array.isArray(payload) ? payload : payload.data || [];

        state.items = cleanSales;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loadingSales = false;
        state.error = action.payload as string;
      });

    ///FETCH BY ID
    builder.addCase(fetchSaleById.fulfilled, (state, action) => {
      state.loadingSelected = false;
      state.selectedSale = action.payload;
    });
    builder
      .addCase(fetchSaleById.pending, (state) => {
        state.loadingSelected = true;
        state.selectedSale = null;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.error = action.payload as string;
      });

    // CREATE ---
    builder.addCase(createSale.fulfilled, (state, action) => {
      state.paginated.items.unshift(action.payload);
      state.items.unshift(action.payload);
      state.paginated.meta.totalSales += 1;
      if (state.paginated.items.length > 10) state.paginated.items.pop();
      if (state.items.length > 5) state.items.pop();
    });

    //UPDATE STATUS
    builder.addCase(updateSaleStatus.fulfilled, (state, action) => {
      const updated = action.payload;
      const indexPag = state.paginated.items.findIndex((s) => s.id === updated.id);
      if (indexPag !== -1) {
        state.paginated.items[indexPag] = {
          ...state.paginated.items[indexPag],
          ...updated,
          customer: state.paginated.items[indexPag].customer,
          items: state.paginated.items[indexPag].items,
        };
      }

      const indexDash = state.items.findIndex((s) => s.id === updated.id);
      if (indexDash !== -1) {
        state.items[indexDash] = {
          ...state.items[indexDash],
          ...updated,
          customer: state.items[indexDash].customer,
          items: state.items[indexDash].items,
        };
      }
    });

    // --- BEST SELLERS ---
    builder
      .addCase(fetchBestSellers.pending, (state) => {
        state.loadingBestSellers = true;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.loadingBestSellers = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state) => {
        state.loadingBestSellers = false;
      });
  },
});
export const { resetSelectedSale } = salesSlice.actions;
export default salesSlice.reducer;
