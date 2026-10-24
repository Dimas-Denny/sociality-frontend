import { z } from "zod";

export const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Comment can't be empty")
    .max(500, "Comment is too long"),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
