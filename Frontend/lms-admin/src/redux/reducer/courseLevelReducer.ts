import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CourseService,
  ICourseLevelModel,
} from "../../services/courseService/courseService";
interface CourseLevelState {
  courseLevel: ICourseLevelModel[];
  loading: boolean;
  error: string | null;
}
const initialState: CourseLevelState = {
  courseLevel: [],
  loading: false,
  error: null,
};
export const fetchCourseLevel = createAsyncThunk<
  { courseLevel: ICourseLevelModel[] },
  void,
  { rejectValue: string }
>("course/level", async (_, { rejectWithValue }) => {
  return new Promise<{ courseLevel: ICourseLevelModel[] }>(
    (resolve, reject) => {
      const courseService: CourseService = new CourseService();
      courseService.getCourseLevel({
        callback: (res) => {
          if (res?.success && Array.isArray(res.data)) {
            resolve({ courseLevel: res.data as ICourseLevelModel[] });
          } else {
            reject(rejectWithValue("Failed to fetch course level"));
          }
        },
      });
    }
  ).catch((error) => rejectWithValue(error));
});

const courseSlice = createSlice({
  name: "courseLevel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseLevel.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.courseLevel = action.payload.courseLevel;
      })
      .addCase(fetchCourseLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default courseSlice.reducer;
