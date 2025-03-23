import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CourseService,
  ICourseLanguageModel,
} from "../../services/courseService/courseService";
interface CourseLanguageState {
  courseLanguage: ICourseLanguageModel[];
  loading: boolean;
  error: string | null;
}
const initialState: CourseLanguageState = {
  courseLanguage: [],
  loading: false,
  error: null,
};
const courseService: CourseService = new CourseService();
export const fetchCourseLanguage = createAsyncThunk<
  { courseLanguage: ICourseLanguageModel[] },
  void,
  { rejectValue: string }
>("course/language", async (_, { rejectWithValue }) => {
  return new Promise<{ courseLanguage: ICourseLanguageModel[] }>(
    (resolve, reject) => {
      courseService.getCourseLanguage({
        callback: (res) => {
          if (res?.success && Array.isArray(res.data)) {
            resolve({ courseLanguage: res.data as ICourseLanguageModel[] });
          } else {
            reject(rejectWithValue("Failed to fetch course language"));
          }
        },
      });
    }
  ).catch((error) => rejectWithValue(error));
});

const courseLanguageSlice = createSlice({
  name: "courseLanguage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseLanguage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.courseLanguage = action.payload.courseLanguage;
      })
      .addCase(fetchCourseLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default courseLanguageSlice.reducer;
