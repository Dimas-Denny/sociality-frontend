import { z } from "zod";
import { usernameField } from "@/features/auth/schemas";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/features/posts/schemas";

export const editProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: usernameField,
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[0-9]{10,15}$/.test(v),
      "Number phone must be 10–15 digits",
    ),
  bio: z.string().trim().max(300, "Bio must be 300 characters or less"),
  avatar: z
    .custom<File>((value) => value instanceof File)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only PNG, JPG or WEBP images are allowed",
    )
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      "Image must be 5MB or smaller",
    )
    .optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
