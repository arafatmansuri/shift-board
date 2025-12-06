import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { Department, DepartmentFormData } from "../types";

export const departmentQuery = async <T>({
  endpoint,
  method,
  data,
}: DepartmentFormData): Promise<T> => {
  try {
    const response = await axios(`${BACKEND_URL}/department/${endpoint}`, {
      method,
      data,
      withCredentials: true,
    });
    if (method == "GET") {
      return response.data.departments;
    }
    return response.data.department;
  } catch (err: any) {
    throw {
      message: err.response?.data?.message || "Unknown error",
      status: err?.status,
    };
  }
};
export const useDepartmentQuery = (companyId:string) => {
  return useQuery<
    Department[],
    { message: string; status: number },
    Department[],
    string[]
  >({
    queryKey: ["departmentQuery",companyId],
    queryFn: async ({queryKey}) => {
      const companyId = queryKey[1] as string;
      return await departmentQuery<Department[]>({
        endpoint: `view/${companyId}`,
        method: "GET",
      });
    },
    retry: false,
  });
};
export const useDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Department,{message:string,status:number},DepartmentFormData>({
    mutationKey: ["departmentMutation"],
    mutationFn: async ({ endpoint, method, data }: DepartmentFormData) => {
      return departmentQuery<Department>({ endpoint, method, data });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["departmentQuery"] });
    },
  });
};
