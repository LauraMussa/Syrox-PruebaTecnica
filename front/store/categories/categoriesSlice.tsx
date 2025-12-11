import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllParentCategoriesService,
  addCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getAllCategoriesPaginatedService,
} from "@/services/categories.service";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "@/types/category.types";

/// FETCH
export const fetchPagCategories = createAsyncThunk(
  "categories/fetchPag",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await getAllCategoriesPaginatedService(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchParentCategories = createAsyncThunk(
  "categories/fetchParents",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllParentCategoriesService();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//POST
export const addCategory = createAsyncThunk(
  "categories/add",
  async (data: CreateCategoryDto, { rejectWithValue }) => {
    try {
      return await addCategoryService(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// PATCH
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }: { id: string; data: UpdateCategoryDto }, { rejectWithValue }) => {
    try {
      return await updateCategoryService(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//DELETE
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCategoryService(id);
      return id; // Retornamos el ID para filtrar localmente
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface CategoryState {
  paginated: {
    items: Category[];
    meta: {
      totalCategories: number;
      lastPage: number;
      page: number;
    };
    loading: boolean;
  };
  parentCategories: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoryState = {
  paginated: {
    items: [],
    meta: {
      totalCategories: 0,
      lastPage: 1,
      page: 1,
    },
    loading: false,
  },
  parentCategories: [],
  status: "idle",
  error: null,
};

//SLICE
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    ///FETCH ALL 
    builder
      .addCase(fetchPagCategories.pending, (state) => {
        state.paginated.loading = true;
        state.error = null;
      })
      .addCase(fetchPagCategories.fulfilled, (state, action) => {
        state.paginated.loading = false;
        state.paginated.items = action.payload.data;
        state.paginated.meta = action.payload.meta;
      })
      .addCase(fetchPagCategories.rejected, (state, action) => {
        state.paginated.loading = false;
        state.error = action.payload as string;
      });

    // FETCH PARENTS 
    builder.addCase(fetchParentCategories.fulfilled, (state, action) => {
      state.parentCategories = action.payload;
    });

    // /ADD
    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.paginated.items.unshift(action.payload);
      if (!action.payload.parentId) {
        state.parentCategories.push(action.payload);
      }
      state.status = "succeeded";
    });

    ///UPDATE
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const updated = action.payload;

      const index = state.paginated.items.findIndex((c) => c.id === updated.id);
      if (index !== -1) state.paginated.items[index] = updated;

      const parentIndex = state.parentCategories.findIndex((c) => c.id === updated.id);
      if (!updated.parentId && parentIndex !== -1) {
        state.parentCategories[parentIndex] = updated;
      } else if (!updated.parentId && parentIndex === -1) {
        state.parentCategories.push(updated);
      } else if (updated.parentId && parentIndex !== -1) {
        state.parentCategories.splice(parentIndex, 1);
      }
    });

    ///DELETE
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      const id = action.payload;
      state.paginated.items = state.paginated.items.filter((c) => c.id !== id);
      state.parentCategories = state.parentCategories.filter((c) => c.id !== id);
    });
  },
});

export default categorySlice.reducer;
