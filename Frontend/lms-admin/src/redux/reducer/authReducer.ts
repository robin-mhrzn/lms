import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthHelper, IUser } from "../../utils/authHelper";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}
const storedUser = new AuthHelper().getUserData();
const initialState: AuthState = storedUser
  ? { user: storedUser, isAuthenticated: true }
  : { user: null, isAuthenticated: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      new AuthHelper().setUserData(action.payload);
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
      new AuthHelper().removeUserData();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
