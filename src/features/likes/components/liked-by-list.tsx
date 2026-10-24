"use client";

import { useCallback } from "react";
import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { useOnVisible } from "@/hooks/use-on-visible";
import { getErrorMessage } from "@/lib/api";
import { useMe } from "@/features/me/hooks";
import { FollowButton } from "@/features/follow/components/follow-button";
import { UserListItem } from "@/features/users/components/user-list-item";
import { UserListSkeleton } from "@/features/users/components/user-list-skeleton";
import { useLikedBy } from "../hooks";

export function LikedByList({ postId }: { postId: number }) {
  const { data: me } = useMe();
  const {
    users,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLikedBy(postId);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useOnVisible<HTMLDivElement>(
    loadMore,
    Boolean(hasNextPage),
  );

  const renderList = () => {
    if (isPending) return <UserListSkeleton count={3} />;
    if (isError) {
      return (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      );
    }
    if (users.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-md font-bold">No likes yet</p>
          <p className="text-sm text-neutral-400">
            Be the first to like this post
          </p>
        </div>
      );
    }
    return (
      <>
        <ul className="-mx-4">
          {users.map((user) => {
            const isMe = user.isMe ?? user.username === me?.profile.username;
            return (
              <UserListItem
                key={user.id}
                user={user}
                action={
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {!isMe && (
                      <FollowButton
                        username={user.username}
                        isFollowing={user.isFollowedByMe}
                        className="h-9 px-4"
                      />
                    )}
                    {user.followsMe && (
                      <span className="text-xs text-neutral-400">
                        Follows you
                      </span>
                    )}
                  </div>
                }
              />
            );
          })}
        </ul>
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="size-6 animate-spin text-neutral-400" />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <h2 className="px-4 pt-4 text-md font-bold md:px-6 md:pt-6">Likes</h2>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:px-2 md:pb-6">
        {renderList()}
      </div>
    </>
  );
}
