"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserCheck, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { HeaderAccountMenu } from "@/components/layout/app-header";
import { useOnVisible } from "@/hooks/use-on-visible";
import { getErrorMessage } from "@/lib/api";
import { useMe } from "@/features/me/hooks";
import { useProfile } from "@/features/profile/hooks";
import {
  ProfileTabs,
  type TabItem,
} from "@/features/profile/components/profile-tabs";
import { UserListItem } from "@/features/users/components/user-list-item";
import { UserListSkeleton } from "@/features/users/components/user-list-skeleton";
import type { FollowKind } from "../api";
import { useFollowList } from "../hooks";
import { FollowButton } from "./follow-button";

interface FollowListProps {
  owner: string | null;
  kind: FollowKind;
}

export function FollowList({ owner, kind }: FollowListProps) {
  const router = useRouter();
  const { data: me } = useMe();
  const { data: profile } = useProfile(owner ?? "", owner !== null);

  const {
    users,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFollowList(owner, kind);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useOnVisible<HTMLDivElement>(
    loadMore,
    Boolean(hasNextPage),
  );

  const title = owner
    ? (profile?.name ?? owner)
    : (me?.profile.name ?? "My Profile");
  const counts = owner
    ? profile?.counts
    : me && { followers: me.stats.followers, following: me.stats.following };

  const withCount = (count: number | undefined, label: string) =>
    count === undefined ? label : `${count} ${label}`;

  const tabs: TabItem<FollowKind>[] = [
    {
      id: "followers",
      label: withCount(counts?.followers, "Followers"),
      icon: Users,
    },
    {
      id: "following",
      label: withCount(counts?.following, "Following"),
      icon: UserCheck,
    },
  ];

  const base = owner ? `/profile/${encodeURIComponent(owner)}` : "/me";
  const myUsername = me?.profile.username;

  const renderList = () => {
    if (isPending) return <UserListSkeleton />;
    if (isError) {
      return (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      );
    }
    if (users.length === 0) {
      return kind === "followers" ? (
        <EmptyState
          title="No followers yet"
          description="When people follow this account, they'll show up here."
        />
      ) : (
        <EmptyState
          title="Not following anyone yet"
          description="Accounts followed will show up here."
        />
      );
    }
    return (
      <>
        <ul>
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              action={
                user.username === myUsername ? null : (
                  <FollowButton
                    username={user.username}
                    isFollowing={user.isFollowedByMe}
                    className="h-9 px-4"
                  />
                )
              }
            />
          ))}
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
      <PageHeader title={title} right={<HeaderAccountMenu />} />

      <main className="pt-2 md:mx-auto md:max-w-[812px] md:pt-10">
        <ProfileTabs
          tabs={tabs}
          active={kind}
          onChange={(next) => router.replace(`${base}/${next}`)}
        />
        {renderList()}
      </main>
    </>
  );
}
