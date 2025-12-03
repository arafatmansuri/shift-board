import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from ".";

const initialState = false;

export const sidebarSlice = createSlice({
  initialState,
  name: "sidebarSlice",
  reducers: {
    toggleSidebar(state) {
      state = !state;
      return state;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export const currentSidebar = (state: RootState) => state.sidebar;

export default sidebarSlice.reducer;
