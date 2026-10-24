import { FollowList } from "@/features/follow/components/follow-list";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function FollowersPage({ params }: PageProps) {
  const { username } = await params;
  return <FollowList owner={decodeURIComponent(username)} kind="followers" />;
}
