"use client";

import { Heart } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { openLikedBy } from "@/store/slices/ui-slice";
import type { Post } from "@/features/posts/types";
import { useToggleLike } from "../hooks";

export function LikeButton({ post }: { post: Post }) {
  const dispatch = useAppDispatch();
  const requireAuth = useRequireAuth();
  const toggleLike = useToggleLike();

  const handleToggle = () =>
    requireAuth(() => {
      if (toggleLike.isPending) return;
      toggleLike.mutate({ postId: post.id, liked: !post.likedByMe });
    });

  const hasLikes = post.likeCount > 0;

  return (
    <div className="flex items-center gap-1.5">
      {/* Heart: like / unlike */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={post.likedByMe ? "Unlike" : "Like"}
        aria-pressed={post.likedByMe}
      >
        <Heart
          className={cn(
            "size-6 transition-transform active:scale-90",
            post.likedByMe && "fill-accent-red text-accent-red",
          )}
        />
      </button>

      {/* Counter: open "Liked by" (public, no login needed) */}
      <button
        type="button"
        onClick={() => dispatch(openLikedBy(post.id))}
        disabled={!hasLikes}
        aria-label={`See who liked this post (${post.likeCount})`}
        className="text-md font-semibold enabled:hover:underline"
      >
        {post.likeCount}
      </button>
    </div>
  );
}
