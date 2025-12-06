import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { User, UserFormData } from "../types";

export const employeeQuery = async <T>({
  endpoint,
  method,
  data,
}: UserFormData): Promise<T> => {
  try {
    const response = await axios(`${BACKEND_URL}/employee/${endpoint}`, {
      method,
      data,
      withCredentials: true,
    });
    if (method == "GET") {
      return response.data.employees;
    }
    return response.data.employee;
  } catch (err: any) {
    throw {
      message: err.response?.data?.message || "Unknown error",
      status: err?.status,
    };
  }
};
export const useEmployeeQuery = (companyId:string) => {
  return useQuery<
    User[],
    { message: string; status: number },
    User[],
    string[]
  >({
    queryKey: ["employeeQuery",companyId],
    queryFn: async ({queryKey}) => {
      const companyId = queryKey[1] as string;
      return await employeeQuery<User[]>({ endpoint: `view/${companyId}`, method: "GET" });
    },
    retry: false,
  });
};
export const useEmployeeMutation = <T>() => {
  const queryClient = useQueryClient();
  return useMutation<T, { message: string; status: number }, UserFormData>({
    mutationKey: ["employeeMutation"],
    mutationFn: async <T>({ endpoint, method, data }: UserFormData) => {
      return employeeQuery<T>({ endpoint, method, data });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["employeeQuery"] });
    },
  });
};
