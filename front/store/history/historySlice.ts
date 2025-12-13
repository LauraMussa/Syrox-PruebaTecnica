import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getHistoryService } from "@/services/history.service"; // Ajusta tu ruta
import { AuditLog } from "@/types/history.types";

interface HistoryState {
  items: AuditLog[];
  loading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunk
export const fetchHistory = createAsyncThunk("history/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getHistoryService();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Error al cargar historial");
  }
});

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action: PayloadAction<AuditLog[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;
