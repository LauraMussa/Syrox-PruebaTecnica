import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Customer } from "@/types/customer.types";
import { createCustomerService, getAllCustomersService } from "@/services/customer.service";

//GET
export const fetchCustomers = createAsyncThunk("customers/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await getAllCustomersService();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
//POST
export const addCustomer = createAsyncThunk(
  "customers/add",
  async (customerData: Partial<Customer>, { rejectWithValue }) => {
    try {
      return await createCustomerService(customerData);
    } catch (error: any) {
      return rejectWithValue(error.message || "Error desconocido al crear cliente");
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
        const payload = action.payload as any;
        state.items = Array.isArray(payload) ? payload : payload.data || [];
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default customersSlice.reducer;
