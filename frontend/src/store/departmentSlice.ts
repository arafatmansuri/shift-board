import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";
import type { Department } from "../types";

export interface CreateDepartmentData {
  departmentName: string;
  departmentCode: string;
  departmentManager: string;
}

type DepartmentState = {
  departments: Department[];
};
const initialState: DepartmentState = {
  departments: [],
};

export const DepartmentSlice = createSlice({
  name: "DepartmentSlice",
  initialState,
  reducers: {
    createDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload);
    },
    getDepartment: (state, action: PayloadAction<Department[]>) => {
      state.departments = action.payload;
    },
    removeDepartment: (state, action: PayloadAction<{ id: string }>) => {
      state.departments = state.departments.filter(
        (s) => s._id != action.payload.id
      );
    },
  },
});

export const { createDepartment, getDepartment, removeDepartment } =
  DepartmentSlice.actions;

export const currentDepartments = (state: RootState) => state.departments;

export default DepartmentSlice.reducer;
