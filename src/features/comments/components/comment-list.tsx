"use client";

import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { getErrorMessage } from "@/lib/api";
import { useMe } from "@/features/me/hooks";
import { useComments, useDeleteComment } from "../hooks";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  postId: number;
  postAuthorId: number;
}

export function CommentList({ postId, postAuthorId }: CommentListProps) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
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
}
