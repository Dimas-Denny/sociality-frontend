"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/me/hooks";
import { useAppSelector } from "@/store/hooks";
import { useComments, useDeleteComment } from "../hooks";
import { CommentItem } from "./comment-item";
import { CommentComposer } from "./comment-composer";

interface CommentsPanelProps {
  postId: number;
  postAuthorId: number;
  stickyComposer?: boolean;
}

export function CommentsPanel({
  postId,
  postAuthorId,
  stickyComposer = false,
}: CommentsPanelProps) {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: me } = useMe();
  const deleteComment = useDeleteComment(postId);

  const {
    comments,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useComments(postId);

  const myId = me?.profile.id;

  const handleDelete = (commentId: number) => {
    if (!window.confirm("Delete this comment?")) return;
    deleteComment.mutate(commentId);
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-neutral-400" />
        </div>
      );
    }
    if (isError) {
      return (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      );
    }
    if (comments.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-md font-bold">No Comments yet</p>
          <p className="text-sm text-neutral-400">Start the conversation</p>
        </div>
      );
    }
    return (
      <>
        <ul>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              // API rule: comment owner OR post owner can delete
              canDelete={
                !!myId && (myId === comment.author.id || myId === postAuthorId)
              }
              onDelete={() => handleDelete(comment.id)}
            />
          ))}
        </ul>
        {hasNextPage && (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full py-3 text-sm font-bold text-primary-200 disabled:text-neutral-600"
          >
            {isFetchingNextPage ? "Loading..." : "Load more comments"}
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <h2 className="px-4 pt-4 text-md font-bold">Comments</h2>

      {/* The comment list — this is where renderList() is used */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4">{renderList()}</div>

      <div className={cn(stickyComposer && "sticky bottom-0 z-10 bg-black")}>
        {isAuthenticated ? (
          <CommentComposer postId={postId} />
        ) : (
          <div className="border-t border-neutral-900 p-4 text-center">
            <Link
              href={`/login?returnTo=${encodeURIComponent(pathname)}`}
              className="text-sm font-bold text-primary-200"
            >
              Log in to add a comment
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
