import { AuthGuard } from "@/components/shared/auth-guard";
import { FollowList } from "@/features/follow/components/follow-list";

export default function MyFollowersPage() {
  return (
    <AuthGuard>
      <FollowList owner={null} kind="followers" />
    </AuthGuard>
  );
}
