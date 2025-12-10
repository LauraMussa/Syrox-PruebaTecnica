import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ParentCategory } from "@/types/category.types";
import { getAllParentCategoriesService } from "@/services/categories.service";

/// FETCH
export const fetchParentCategories = createAsyncThunk<ParentCategory[]>(
  "categories/parent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllParentCategoriesService();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/// TYPES
interface CategoryState {
  parentCategories: ParentCategory[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/// INITIAL STATE
const initialState: CategoryState = {
  parentCategories: [],
  status: "idle",
  error: null,
};

/// SLICE
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchParentCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parentCategories = action.payload;
      })
      .addCase(fetchParentCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
