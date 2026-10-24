import type { Metadata } from "next";
import { PostDetail } from "@/features/posts/components/post-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Post | Sociality",
};

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PostDetail postId={Number(id)} />;
}
