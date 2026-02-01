import z from "zod";
export const shiftSchema = z.object({
  employeeId: z.string({ error: "Invalid employeeId" }),
  date: z.iso.date({ error: "Invalid shift date" }),
  startTime: z.string("Invalid start time"),
  endTime: z.string("Invalid end time"),
});