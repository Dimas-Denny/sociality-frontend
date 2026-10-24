import { z } from "zod";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB (API limit)
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const createPostSchema = z.object({
  image: z
    .custom<File>((value) => value instanceof File, "Please upload a photo")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only PNG, JPG or WEBP images are allowed",
    )
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      "Image must be 5MB or smaller",
    ),
  caption: z
    .string()
    .trim()
    .min(1, "Caption is required")
    .max(2200, "Caption is too long"),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
