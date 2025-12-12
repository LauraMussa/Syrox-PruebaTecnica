import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Importa js-cookie

interface User {
  id: string;
  email: string;
  name?: string; 
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const tokenFromCookie = Cookies.get("auth-token") || null;

const initialState: AuthState = {
  user: null, 
  token: tokenFromCookie,
  isAuthenticated: !!tokenFromCookie,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove("auth-token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
