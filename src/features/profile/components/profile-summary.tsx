import { UserAvatar } from "@/components/shared/user-avatar";

interface ProfileSummaryProps {
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  actions: React.ReactNode; // Edit Profile (mine) or Follow (public)
}

export function ProfileSummary({
  name,
  username,
  avatarUrl,
  bio,
  actions,
}: ProfileSummaryProps) {
  return (
    <section className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex items-center gap-3">
        <UserAvatar src={avatarUrl} name={name} size={64} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{name}</p>
          <p className="truncate text-sm">{username}</p>
        </div>
      </div>

      {actions}

      {bio && <p className="text-sm whitespace-pre-line">{bio}</p>}
    </section>
  );
}
