import z from "zod";
export const departmentSchema = z.object({
  departmentName: z.string().min(2, { error: "Department name is too short" }),
  departmentCode: z.string(),
  departmentManager: z.string().optional(),
});