import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import productsReducer from "./products/productsSlice";
import salesReducer from "./sales/salesSlice";
import categoriesReducer from "./categories/categoriesSlice";
import customersReducer from "./customers/customerSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  sales: salesReducer,
  categories: categoriesReducer,
  customers: customersReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
