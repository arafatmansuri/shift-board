import z from "zod";
export const companySchema = z.object({
  companyName: z.string().min(2, { error: "Company name is too short" }),
  companyEmail: z.email({ error: "Invalid email address" }),
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
  companySize: z.number({ error: "Size should be a number" }).optional(),
});