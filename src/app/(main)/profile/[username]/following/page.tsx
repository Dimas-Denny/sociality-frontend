import { FollowList } from "@/features/follow/components/follow-list";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function FollowingPage({ params }: PageProps) {
  const { username } = await params;
  return <FollowList owner={decodeURIComponent(username)} kind="following" />;
}
