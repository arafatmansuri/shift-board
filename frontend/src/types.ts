import type { CreateDepartmentData } from "./store/departmentSlice";

export interface Company{
  _id:string;
  companyName:string;
  companyEmail:string;
  companyPassword?:string;
  companySize?:number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: "employee" | "admin";
  employeeCode?: string;
  department?: string | Department;
  company?: string | Company;
  refreshToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  _id: string;
  departmentName: string;
  departmentCode: string;
  company: string;
  departmentManager?: string | User;
}

export interface Shift {
  _id?: string;
  date: string;
  startTime: string;
  endTime: string;
  employeeId: string | User;
  company: string;
}

export interface LoginRequest {
  companyName: string;
  email?: string;
  username?: string;
  password: string;
}
export interface AuthRequest {
  companyName: string;
  companyEmail: string;
  companyPassword: string;
  companySize?: number;
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
  data?: AuthRequest;
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
export type CompanyFormData = Omit<UserFormData, "data"> & {
  data?: AuthRequest;
};
