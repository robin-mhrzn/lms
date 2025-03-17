import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
