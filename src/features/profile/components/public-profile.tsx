"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, LayoutGrid, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { HeaderAccountMenu } from "@/components/layout/app-header";
import { getErrorMessage, isNotFound } from "@/lib/api";
import { FollowButton } from "@/features/follow/components/follow-button";
import { PostGrid } from "@/features/posts/components/post-grid";
import { useProfile, useUserLikes, useUserPosts } from "../hooks";
import { ProfileSummary } from "./profile-summary";
import { ProfileStats } from "./profile-stats";
import { ProfileTabs, type TabItem } from "./profile-tabs";

type PublicTab = "gallery" | "liked";

const TABS: TabItem<PublicTab>[] = [
  { id: "gallery", label: "Gallery", icon: LayoutGrid },
  { id: "liked", label: "Liked", icon: Heart },
];

export function PublicProfile({ username }: { username: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<PublicTab>("gallery");

  const {
    data: profile,
    isPending,
    isError,
    error,
    refetch,
  } = useProfile(username);
  const posts = useUserPosts(username);
  const likes = useUserLikes(username, tab === "liked");

  useEffect(() => {
    if (profile?.isMe) router.replace("/me");
  }, [profile?.isMe, router]);

  const header = (title: string) => (
    <PageHeader title={title} right={<HeaderAccountMenu />} />
  );

  if (isPending || profile?.isMe) {
    return (
      <>
        {header(username)}
        <div className="flex min-h-[60dvh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-neutral-400" />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        {header(username)}
        {isNotFound(error) ? (
          <EmptyState
            title="User not found"
            description={`There's no account with the username "${username}".`}
          />
        ) : (
          <ErrorState
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
          />
        )}
      </>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const base = `/profile/${encodeURIComponent(profile.username)}`;

  return (
    <>
      {header(profile.name)}

      <main className="md:mx-auto md:max-w-203">
        <ProfileSummary
          name={profile.name}
          username={profile.username}
          avatarUrl={profile.avatarUrl}
          bio={profile.bio}
          actions={
            <div className="flex items-center gap-3">
              <FollowButton
                username={profile.username}
                isFollowing={profile.isFollowing}
                className="flex-1 md:h-12 md:flex-none md:px-6 md:text-md"
              />
              <button
                type="button"
                onClick={handleShare}
                aria-label="Copy profile link"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-900 transition-colors hover:bg-neutral-900 md:size-12"
              >
                <Send className="size-5" />
              </button>
            </div>
          }
        />

        <ProfileStats
          items={[
            { label: "Post", value: profile.counts.post },
            {
              label: "Followers",
              value: profile.counts.followers,
              href: `${base}/followers`,
            },
            {
              label: "Following",
              value: profile.counts.following,
              href: `${base}/following`,
            },
            { label: "Likes", value: profile.counts.likes },
          ]}
        />

        <ProfileTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "gallery" ? (
          <PostGrid
            result={posts}
            empty={
              <EmptyState
                title="No posts yet"
                description={`${profile.name} hasn't shared anything yet.`}
              />
            }
          />
        ) : (
          <PostGrid
            result={likes}
            empty={
              <EmptyState
                title="No liked posts"
                description={`${profile.name} hasn't liked any posts yet.`}
              />
            }
          />
        )}
      </main>
    </>
  );
}
