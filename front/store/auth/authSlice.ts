import { logoutService } from "@/services/auth.service";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const userFromStorage = typeof window !== "undefined" ? localStorage.getItem("auth-user") : null;

export const performLogout = createAsyncThunk("auth/performLogout", async (_, { dispatch }) => {
  await logoutService();

  dispatch(authSlice.actions.logout());
});

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  isAuthenticated: !!userFromStorage,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("auth-user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth-user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
