"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { HeaderAccountMenu } from "@/components/layout/app-header";
import { getErrorMessage, isNotFound } from "@/lib/api";
import { useMe } from "@/features/me/hooks";
import { CommentsPanel } from "@/features/comments/components/comments-panel";
import { useDeletePost, usePost } from "../hooks";
import { PostCard } from "./post-card";
import { PostCardSkeleton } from "./post-card-skeleton";
import { PostOwnerMenu } from "./post-owner-menu";

export function PostDetail({ postId }: { postId: number }) {
  const router = useRouter();
  const { data: post, isPending, isError, error, refetch } = usePost(postId);
  const { data: me } = useMe();
  const deletePost = useDeletePost();

  const isValidId = Number.isInteger(postId) && postId > 0;
  const header = <PageHeader title="Post" right={<HeaderAccountMenu />} />;

  if (!isValidId || (isError && isNotFound(error))) {
    return (
      <>
        {header}
        <EmptyState
          title="Post not found"
          description="It may have been deleted."
        />
      </>
    );
  }

  if (isError) {
    return (
      <>
        {header}
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </>
    );
  }

  if (isPending) {
    return (
      <>
        {header}
        <PostCardSkeleton />
      </>
    );
  }

  const isOwner = me?.profile.id === post.author.id;

  const handleDelete = () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    deletePost.mutate(post.id, {
      onSuccess: () => {
        toast.success("Post deleted");
        router.replace("/me");
      },
    });
  };

  return (
    <>
      {header}

      <main>
        <PostCard
          post={post}
          variant="detail"
          priority
          headerAction={
            isOwner ? (
              <PostOwnerMenu
                onDelete={handleDelete}
                isDeleting={deletePost.isPending}
              />
            ) : null
          }
          onCommentClick={() =>
            document.getElementById("comment-input")?.focus()
          }
        />

        <section aria-label="Comments" className="flex flex-col">
          <CommentsPanel
            postId={post.id}
            postAuthorId={post.author.id}
            stickyComposer
          />
        </section>
      </main>
    </>
  );
}
