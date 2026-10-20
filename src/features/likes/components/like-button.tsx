"use client";

import { Heart } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";
import type { Post } from "@/features/posts/types";
import { useToggleLike } from "../hooks";

export function LikeButton({ post }: { post: Post }) {
  const requireAuth = useRequireAuth();
  const toggleLike = useToggleLike();

  const handleClick = () =>
    requireAuth(() => {
      // Ignore rapid clicks while the previous request is still running
      if (toggleLike.isPending) return;
      toggleLike.mutate({ postId: post.id, liked: !post.likedByMe });
    });

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={post.likedByMe ? "Unlike" : "Like"}
      aria-pressed={post.likedByMe}
      className="flex items-center gap-1.5"
    >
      <Heart
        className={cn(
          "size-6 transition-transform active:scale-90",
          post.likedByMe && "fill-accent-red text-accent-red",
        )}
      />
      <span className="text-md font-semibold">{post.likeCount}</span>
    </button>
  );
}
