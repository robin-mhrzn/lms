import {
  CategoryService,
  ICategorySelectModel,
} from "../../services/categoryService/categoryService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
interface CategoryState {
  parentCategories: ICategorySelectModel[];
  childCategories: { [key: number]: ICategorySelectModel[] };
  loading: boolean;
  error: string | null;
}
const initialState: CategoryState = {
  parentCategories: [],
  childCategories: {},
  loading: false,
  error: null,
};

export const fetchParentCategories = createAsyncThunk<
  { parentCategories: ICategorySelectModel[] },
  void,
  { rejectValue: string }
>("categories/fetchParentCategories", async (_, { rejectWithValue }) => {
  return new Promise<{ parentCategories: ICategorySelectModel[] }>(
    (resolve, reject) => {
      const categoryService: CategoryService = new CategoryService();
      categoryService.getParentCategoryList({
        callback: (res) => {
          if (res?.success && Array.isArray(res.data)) {
            resolve({ parentCategories: res.data as ICategorySelectModel[] });
          } else {
            reject(rejectWithValue("Failed to fetch parent categories"));
          }
        },
      });
    }
  ).catch((error) => rejectWithValue(error));
});

export const fetchChildCategories = createAsyncThunk<
  { parentCategoryId: number; subCategories: ICategorySelectModel[] },
  number,
  { rejectValue: string }
>(
  "categories/fetchChildCategories",
  async (parentCategoryId, { rejectWithValue }) => {
    try {
      return await new Promise<{
        parentCategoryId: number;
        subCategories: ICategorySelectModel[];
      }>((resolve, reject) => {
        if (parentCategoryId > 0) {
          const categoryService: CategoryService = new CategoryService();
          categoryService.getChildCategory({
            parentCategoryId,
            callback: (res) => {
              if (res?.success && Array.isArray(res.data)) {
                resolve({
                  parentCategoryId,
                  subCategories: res.data as ICategorySelectModel[],
                });
              } else {
                reject(rejectWithValue("Failed to fetch child categories"));
              }
            },
          });
        } else {
          reject(rejectWithValue("Failed to fetch child categories"));
        }
      });
    } catch (error) {
      return rejectWithValue("Failed to fetch child categories");
    }
  }
);
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParentCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.parentCategories = action.payload.parentCategories;
      })
      .addCase(fetchParentCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChildCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChildCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.childCategories[action.payload.parentCategoryId] =
          action.payload.subCategories;
      })
      .addCase(fetchChildCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
