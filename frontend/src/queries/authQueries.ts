import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { User, UserFormData } from "../types";

export const authUser = async <T>({
  endpoint,
  method,
  data,
}: UserFormData): Promise<T> => {
  try {
    const response = await axios(`${BACKEND_URL}/auth/${endpoint}`, {
      data,
      method,
      withCredentials: true,
    });
    return response.data.user;
  } catch (err: any) {
    throw {
      message:
        err.response?.data?.message || "Something went wrong from ourside",
      status: err?.status,
    };
  }
};

export const useUserQuery = (endpoint: string) => {
  return useQuery({
    queryKey: ["userQuery", endpoint],
    queryFn: async ({ queryKey }) => {
      const endpoint = queryKey[1];
      return await authUser<User>({
        endpoint: endpoint as string,
        method: "GET",
      });
    },
    retry: false,
  });
};

export const useLoginMutation = () => {
  return useMutation<User, { message: string,status:number }, UserFormData>({
    mutationKey: ["loginMutation"],
    mutationFn: async ({ endpoint, method, data }: UserFormData) => {
      return await authUser<User>({ endpoint, method, data });
    },
    onError: (error) => {
      if (!error.message || error.status !== 401) {
        throw new Error("Network Error");
      }
    },
  });
};
