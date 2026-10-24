"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { fromNow } from "@/lib/date";
import { useAppDispatch } from "@/store/hooks";
import { openComments } from "@/store/slices/ui-slice";
import type { Post } from "../types";
import { PostActions } from "./post-actions";
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

  const image = (
    <PostImage
      src={post.imageUrl}
      alt={post.caption || `Post by ${author.username}`}
      // Mobile: full width. Desktop: inside the 600px feed column
      sizes="(min-width: 768px) 600px, 100vw"
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

      <PostActions post={post} onCommentClick={showComments} />

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
