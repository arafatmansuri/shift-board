import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Shift } from "../types";
import type { RootState } from ".";


type ShiftState = {
  shifts: Shift[];
};
const initialState: ShiftState = {
  shifts: [],
};

export const shiftSlice = createSlice({
  name: "shiftSlice",
  initialState,
  reducers: {
    createShift: (state, action: PayloadAction<Shift>) => {
      state.shifts.push(action.payload);
    },
    getShifts: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload;
    },
    removeShift: (state, action: PayloadAction<{ id: string }>) => {
      state.shifts = state.shifts.filter((s) => s._id != action.payload.id);
    },
  },
});

export const { createShift, getShifts,removeShift } = shiftSlice.actions;

export const currentShifts = (state: RootState) => state.shifts;

export default shiftSlice.reducer;