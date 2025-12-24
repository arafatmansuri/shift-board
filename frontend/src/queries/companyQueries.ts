import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { Company, CompanyFormData, User } from "../types";

export const companyQuery = async <T>({
  endpoint,
  method,
  data,
}: CompanyFormData): Promise<T> => {
  try {
    const response = await axios(`${BACKEND_URL}/company/${endpoint}`, {
      method,
      data,
      withCredentials: true,
    });
    if (method == "GET") {
      return response.data;
    }
    // console.log(response.data);
    return response.data.user;
  } catch (err: any) {
    throw {
      message: err.response?.data?.message || "Unknown error",
      status: err?.status,
    };
  }
};
export const useCompanyQuery = () => {
  return useQuery<
    Company[],
    { message: string; status: number },
    Company[],
    string[]
  >({
    queryKey: ["companyQuery"],
    queryFn: async () => {
      return await companyQuery<Company[]>({
        endpoint: "view",
        method: "GET",
      });
    },
    retry: false,
  });
};
export const useCompanyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    User,
    { message: string; status: number },
    CompanyFormData
  >({
    mutationKey: ["companyMutation"],
    mutationFn: async ({ endpoint, method, data }: CompanyFormData) => {
      return companyQuery<User>({
        endpoint,
        method,
        data,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["companyQuery"] });
    },
  });
};
