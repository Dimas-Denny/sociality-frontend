"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, LayoutGrid, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { UserMenu } from "@/components/layout/app-header";
import { getErrorMessage } from "@/lib/api";
import { PostGrid } from "@/features/posts/components/post-grid";
import { ProfileSummary } from "@/features/profile/components/profile-summary";
import { ProfileStats } from "@/features/profile/components/profile-stats";
import {
  ProfileTabs,
  type TabItem,
} from "@/features/profile/components/profile-tabs";
import { useSavedPosts } from "@/features/saves/hooks";
import { useMe, useMyPosts } from "../hooks";

type MyTab = "gallery" | "saved";

const TABS: TabItem<MyTab>[] = [
  { id: "gallery", label: "Gallery", icon: LayoutGrid },
  { id: "saved", label: "Saved", icon: Bookmark },
];

const primaryButtonClass =
  "h-10 rounded-full bg-primary-300 px-8 text-sm font-bold text-neutral-25 hover:bg-primary-200";

export function MyProfile() {
  const [tab, setTab] = useState<MyTab>("gallery");
  const { data, isLoading, isError, error, refetch } = useMe();
  const myPosts = useMyPosts();
  const savedPosts = useSavedPosts(tab === "saved"); // lazy: fetch on first open

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
    );
  }

  const { profile, stats } = data;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${profile.username}`,
      );
      toast.success("Profile link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <>
      <PageHeader title={profile.name} right={<UserMenu />} />

      <main>
        <ProfileSummary
          name={profile.name}
          username={profile.username}
          avatarUrl={profile.avatarUrl}
          bio={profile.bio}
          actions={
            <div className="flex items-center gap-3">
              <Button
                render={<Link href="/me/edit" />}
                nativeButton={false}
                className="h-10 flex-1 rounded-full border border-neutral-900 bg-transparent text-sm font-bold text-neutral-25 hover:bg-neutral-900"
              >
                Edit Profile
              </Button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Copy profile link"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-900 transition-colors hover:bg-neutral-900"
              >
                <Send className="size-5" />
              </button>
            </div>
          }
        />

        <ProfileStats
          items={[
            { label: "Post", value: stats.posts },
            {
              label: "Followers",
              value: stats.followers,
              href: "/me/followers",
            },
            {
              label: "Following",
              value: stats.following,
              href: "/me/following",
            },
            { label: "Likes", value: stats.likes },
          ]}
        />

        <ProfileTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "gallery" ? (
          <PostGrid
            result={myPosts}
            empty={
              <EmptyState
                title="Your story starts here"
                description="Share your first post and let the world see your moments, passions, and memories. Make this space truly yours."
                action={
                  <Button
                    render={<Link href="/posts/new" />}
                    nativeButton={false}
                    className={primaryButtonClass}
                  >
                    Upload My First Post
                  </Button>
                }
              />
            }
          />
        ) : (
          <PostGrid
            result={savedPosts}
            empty={
              <EmptyState
                title="No saved posts yet"
                description="Tap the bookmark on any post to keep it here."
              />
            }
          />
        )}
      </main>
    </>
  );
}
