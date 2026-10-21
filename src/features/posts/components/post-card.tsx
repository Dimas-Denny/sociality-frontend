"use client";

import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/shared/user-avatar";
import { LikeButton } from "@/features/likes/components/like-button";
import { SaveButton } from "@/features/saves/components/save-button";
import { fromNow } from "@/lib/date";
import { useAppDispatch } from "@/store/hooks";
import { openComments } from "@/store/slices/ui-slice";
import type { Post } from "../types";
import { PostImage } from "./post-image";
import { PostCaption } from "./post-caption";

export function PostCard({ post }: { post: Post }) {
  const { author } = post;
  const profileHref = `/profile/${author.username}`;
  const postHref = `/posts/${post.id}`;

  const dispatch = useAppDispatch();
  const showComments = () =>
    dispatch(openComments({ postId: post.id, postAuthorId: author.id }));

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${postHref}`,
      );
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <article className="flex flex-col gap-3 border-b border-neutral-900 px-4 py-4">
      {/* Author */}
      <Link href={profileHref} className="flex items-center gap-3">
        <UserAvatar src={author.avatarUrl} name={author.name} size={40} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{author.name}</p>
          <p className="text-xs text-neutral-400 capitalize">
            {fromNow(post.createdAt)}
          </p>
        </div>
      </Link>

      {/* Image — PostImage is used here */}
      <Link href={postHref}>
        <PostImage
          src={post.imageUrl}
          alt={post.caption || `Post by ${author.username}`}
        />
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton post={post} />

          {/* Opens the global comments sheet (Redux ui-slice) */}
          <button
            type="button"
            onClick={showComments}
            aria-label="Show comments"
            className="flex items-center gap-1.5"
          >
            <MessageCircle className="size-6" />
            <span className="text-md font-semibold">{post.commentCount}</span>
          </button>

          <button
            type="button"
            aria-label="Copy post link"
            onClick={handleShare}
          >
            <Send className="size-6" />
          </button>
        </div>

        <SaveButton postId={post.id} />
      </div>

      {/* Caption */}
      <div className="flex flex-col gap-0.5">
        <Link href={profileHref} className="text-sm font-bold">
          {author.username}
        </Link>
        {post.caption && <PostCaption text={post.caption} />}
      </div>
    </article>
  );
}
