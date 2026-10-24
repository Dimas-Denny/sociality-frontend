import { UserAvatar } from "@/components/shared/user-avatar";

interface ProfileSummaryProps {
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  actions: React.ReactNode;
}

export function ProfileSummary({
  name,
  username,
  avatarUrl,
  bio,
  actions,
}: ProfileSummaryProps) {
  return (
    <section className="flex flex-col gap-4 px-4 pt-4 md:px-0 md:pt-10">
      {/* Mobile: stacked. Desktop: identity on the left, actions on the right */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <UserAvatar src={avatarUrl} name={name} size={64} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold md:text-md">{name}</p>
            <p className="truncate text-sm md:text-md">{username}</p>
          </div>
        </div>
        <div className="md:shrink-0">{actions}</div>
      </div>

      {bio && <p className="text-sm whitespace-pre-line md:text-md">{bio}</p>}
    </section>
  );
}
