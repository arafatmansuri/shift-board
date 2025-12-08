import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";
import type { User } from "../types";

export interface CreateEmployeeData {
  username: string;
  email: string;
  password: string;
  employeeCode: string;
  department: string;
  companyName:string;
}

type EmployeeState = {
  employees: User[];
};
const initialState: EmployeeState = {
  employees: [],
};

export const EmployeeSlice = createSlice({
  name: "EmployeeSlice",
  initialState,
  reducers: {
    createEmployee: (state, action: PayloadAction<User>) => {
      state.employees.push(action.payload);
    },
    getEmployee: (state, action: PayloadAction<User[]>) => {
      state.employees = action.payload;
    },
    removeEmployee: (state, action: PayloadAction<{ id: string }>) => {
      state.employees = state.employees.filter(
        (s) => s._id != action.payload.id
      );
    },
  },
});

export const { createEmployee, getEmployee, removeEmployee } =
  EmployeeSlice.actions;

export const currentEmployees = (state: RootState) => state.employees;

export default EmployeeSlice.reducer;
