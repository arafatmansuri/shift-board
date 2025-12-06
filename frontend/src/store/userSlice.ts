import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";
import type { User } from "../types";

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: UserState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  isAuthenticated: !!localStorage.getItem("user"),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setisAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | null; isAuthorized: boolean }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthorized;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setisAuthorized, setCredentials, logout } =
  userSlice.actions;
export const currentUser = (state: RootState) => state.user;

export default userSlice.reducer;
