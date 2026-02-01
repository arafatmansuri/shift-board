import z from "zod";

export const loginSchema = z.object({
  companyName: z.string({ error: "company name must be string" }).trim(),
  companyEmail: z.email({ error: "Invalid email address" }),
  companyPassword: z.string({ error: "Password must be string" }),
});
export const forgetInputSchema = z.object({
  OTP: z.number(),
  companyPassword: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special character",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
});