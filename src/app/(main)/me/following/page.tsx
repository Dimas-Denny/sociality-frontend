import { AuthGuard } from "@/components/shared/auth-guard";
import { FollowList } from "@/features/follow/components/follow-list";

export default function MyFollowingPage() {
  return (
    <AuthGuard>
      <FollowList owner={null} kind="following" />
    </AuthGuard>
  );
}
