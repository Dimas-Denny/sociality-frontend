import type { Metadata } from "next";
import { PublicProfile } from "@/features/profile/components/public-profile";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${decodeURIComponent(username)} | Sociality` };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <PublicProfile username={decodeURIComponent(username)} />;
}
