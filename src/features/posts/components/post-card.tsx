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

interface PostCardProps {
  post: Post;
  priority?: boolean;
  variant?: "feed" | "detail";
  headerAction?: React.ReactNode;
  onCommentClick?: () => void;
}

export function PostCard({
  post,
  priority = false,
  variant = "feed",
  headerAction,
  onCommentClick,
}: PostCardProps) {
  const { author } = post;
  const isDetail = variant === "detail";
  const profileHref = `/profile/${author.username}`;
  const postHref = `/posts/${post.id}`;

  const dispatch = useAppDispatch();
  const showComments =
    onCommentClick ??
    (() =>
      dispatch(openComments({ postId: post.id, postAuthorId: author.id })));

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

  const image = (
    <PostImage
      src={post.imageUrl}
      alt={post.caption || `Post by ${author.username}`}
      priority={priority}
    />
  );

  return (
    <article className="flex flex-col gap-3 border-b border-neutral-900 px-4 py-4">
      {/* Author */}
      <div className="flex items-center justify-between gap-3">
        <Link href={profileHref} className="flex min-w-0 items-center gap-3">
          <UserAvatar src={author.avatarUrl} name={author.name} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{author.name}</p>
            <p className="text-xs text-neutral-400 capitalize">
              {fromNow(post.createdAt)}
            </p>
          </div>
        </Link>
        {headerAction}
      </div>

      {/* Image: links to detail in the feed, plain on the detail page */}
      {isDetail ? image : <Link href={postHref}>{image}</Link>}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton post={post} />

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
        {post.caption && (
          <PostCaption text={post.caption} alwaysExpanded={isDetail} />
        )}
      </div>
    </article>
  );
}
