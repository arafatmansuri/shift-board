import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { Shift, ShiftFormData } from "../types";

export const shiftQuery = async <T>({
  endpoint,
  method,
  data,
}: ShiftFormData): Promise<T> => {
  try {
    const response = await axios(`${BACKEND_URL}/shift/${endpoint}`, {
      method,
      data,
      withCredentials: true,
    });
    if (method == "GET") {
      return response.data.shifts;
    }
    return response.data.shift;
  } catch (err: any) {
    throw {
      message: err.response?.data?.message || "Unknown error",
      status: err?.status,
    };
  }
};
export const useShiftQuery = (endpoint: string) => {
  return useQuery<Shift[], { message: string; status: number }, Shift[]>({
    queryKey: ["shiftQuery", endpoint],
    queryFn: async ({ queryKey }) => {
      const endpoint = queryKey[1] as string;
      return await shiftQuery<Shift[]>({ endpoint, method: "GET" });
    },
    retry: false,
  });
};
export const useShiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Shift,{message:string,status:number},ShiftFormData,string>({
    mutationKey: ["shiftMutation"],
    mutationFn: async ({ endpoint, method, data }: ShiftFormData) => {
      return shiftQuery<Shift>({ endpoint, method, data });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["shiftQuery"] });
    },
  });
};
