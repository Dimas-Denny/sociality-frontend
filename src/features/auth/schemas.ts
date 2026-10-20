import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Please enter a valid email"));

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: emailField,
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .regex(/^\S+$/, "Username cannot contain spaces"),
    phone: z
      .string()
      .trim()
      .min(1, "Number phone is required")
      .regex(/^[0-9]{10,15}$/, "Number phone must be 10–15 digits"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"), // API rule: minLength 6
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
