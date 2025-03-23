import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import categoryReducer from "./reducer/categoryReducer";
import courseLevelReducer from "./reducer/courseLevelReducer";
import courseLanguageReducer from "./reducer/courseLanguageReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    courseLevel: courseLevelReducer,
    courseLanguage: courseLanguageReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
