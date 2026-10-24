"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { getErrorMessage, isNotFound } from "@/lib/api";
import { fromNow } from "@/lib/date";
import { useAppDispatch } from "@/store/hooks";
import { closeComments } from "@/store/slices/ui-slice";
import { useMe } from "@/features/me/hooks";
import { useDeletePost, usePost } from "@/features/posts/hooks";
import { PostActions } from "@/features/posts/components/post-actions";
import { PostOwnerMenu } from "@/features/posts/components/post-owner-menu";
import { CommentList } from "./comment-list";
import { CommentInputArea } from "./comment-input-area";

const MODAL_HEIGHT = "h-[min(720px,85dvh)]";

// Desktop: image on the left, author + caption + comments on the right
export function PostCommentsModal({ postId }: { postId: number }) {
  const dispatch = useAppDispatch();
  const { data: post, isPending, isError, error, refetch } = usePost(postId);
  const { data: me } = useMe();
  const deletePost = useDeletePost();

  if (isPending) {
    return (
      <div className={`flex ${MODAL_HEIGHT} items-center justify-center`}>
        <Loader2 className="size-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="p-6">
        {isNotFound(error) ? (
          <EmptyState
            title="Post not found"
            description="It may have been deleted."
          />
        ) : (
          <ErrorState
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
          />
        )}
      </div>
    );
  }

  const { author } = post;
  const profileHref = `/profile/${author.username}`;
  const isOwner = me?.profile.id === author.id;

  const handleDelete = () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    deletePost.mutate(post.id, {
      onSuccess: () => {
        toast.success("Post deleted");
        dispatch(closeComments());
      },
    });
  };

  return (
    <div
      className={`grid ${MODAL_HEIGHT} grid-cols-[minmax(0,1fr)_400px] lg:grid-cols-[minmax(0,1fr)_460px]`}
    >
      {/* Left: image */}
      <div className="relative bg-black">
        <Image
          src={post.imageUrl}
          alt={post.caption || `Post by ${author.username}`}
          fill
          sizes="720px"
          className="object-cover"
        />
      </div>

      {/* Right: details */}
      <div className="flex min-h-0 flex-col border-l border-neutral-900">
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <Link href={profileHref} className="flex min-w-0 items-center gap-3">
            <UserAvatar src={author.avatarUrl} name={author.name} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{author.name}</p>
              <p className="text-xs text-neutral-400 capitalize">
                {fromNow(post.createdAt)}
              </p>
            </div>
          </Link>
          {isOwner && (
            <PostOwnerMenu
              onDelete={handleDelete}
              isDeleting={deletePost.isPending}
            />
          )}
        </div>

        {/* Caption + comments scroll together */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {post.caption && (
            <p className="border-b border-neutral-900 py-4 text-sm whitespace-pre-line">
              {post.caption}
            </p>
          )}
          <h3 className="pt-4 text-md font-bold">Comments</h3>
          <CommentList postId={post.id} postAuthorId={author.id} />
        </div>

        <div className="px-4 py-3">
          <PostActions
            post={post}
            onCommentClick={() =>
              document.getElementById("comment-input")?.focus()
            }
          />
        </div>

        <CommentInputArea postId={post.id} />
      </div>
    </div>
  );
}
