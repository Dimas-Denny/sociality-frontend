"use client";

import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { LikeButton } from "@/features/likes/components/like-button";
import { SaveButton } from "@/features/saves/components/save-button";
import type { Post } from "../types";

interface PostActionsProps {
  post: Post;
  onCommentClick: () => void;
}

export function PostActions({ post, onCommentClick }: PostActionsProps) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/posts/${post.id}`,
      );
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <LikeButton post={post} />

        <button
          type="button"
          onClick={onCommentClick}
          aria-label="Show comments"
          className="flex items-center gap-1.5"
        >
          <MessageCircle className="size-6" />
          <span className="text-md font-semibold">{post.commentCount}</span>
        </button>

        <button type="button" aria-label="Copy post link" onClick={handleShare}>
          <Send className="size-6" />
        </button>
      </div>

      <SaveButton postId={post.id} />
    </div>
  );
}
