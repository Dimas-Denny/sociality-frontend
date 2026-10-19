import { z } from "zod";

export const loginSchema = z.object({
  // Check "empty" first, then format — so the user sees the right message
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Please enter a valid email")),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
