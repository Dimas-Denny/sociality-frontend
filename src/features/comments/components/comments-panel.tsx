"use client";

import { cn } from "@/lib/utils";
import { CommentList } from "./comment-list";
import { CommentInputArea } from "./comment-input-area";

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
  return (
    <>
      <h2 className="px-4 pt-4 text-md font-bold">Comments</h2>

      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        <CommentList postId={postId} postAuthorId={postAuthorId} />
      </div>

      <div className={cn(stickyComposer && "sticky bottom-0 z-10 bg-black")}>
        <CommentInputArea postId={postId} />
      </div>
    </>
  );
}
