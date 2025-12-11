import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Customer } from "@/types/customer.types"; 
import { getAllCustomersService } from "@/services/customer.service";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllCustomersService();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface CustomersState {
  items: Customer[]; 
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CustomersState = {
  items: [],
  status: "idle",
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Si tu backend devuelve { data: [...] }, extraelo igual que en sales
        const payload = action.payload as any;
        state.items = Array.isArray(payload) ? payload : (payload.data || []);
      });
  },
});

export default customersSlice.reducer;
