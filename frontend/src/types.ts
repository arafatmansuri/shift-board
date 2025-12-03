import type { CreateDepartmentData } from "./store/departmentSlice";

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: "employee" | "admin";
  employeeCode?: string;
  department?: string | Department;
  refreshToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  _id: string;
  departmentName: string;
  departmentCode: string;
  departmentManager: string | User;
}

export interface Shift {
  _id?: string;
  date: string;
  startTime: string;
  endTime: string;
  employeeId: string | User;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  success: boolean;
  user: User;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data?: T;
}

export type UserFormData = {
  data?: LoginRequest;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
};

export type ShiftFormData = Omit<UserFormData, "data"> & {
  data?: Shift;
};
export type DepartmentFormData = Omit<UserFormData, "data"> & {
  data?: CreateDepartmentData;
};
