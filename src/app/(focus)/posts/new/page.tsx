import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";
import { CreatePostForm } from "@/features/posts/components/create-post-form";

export const metadata: Metadata = {
  title: "Add Post | Sociality",
};

export default function CreatePostPage() {
  return (
    <AuthGuard>
      <CreatePostForm />
    </AuthGuard>
  );
}
