export function UserListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="animate-pulse py-1">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-2 px-4 py-3">
          <div className="size-12 rounded-full bg-neutral-900" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-28 rounded bg-neutral-900" />
            <div className="h-3 w-20 rounded bg-neutral-900" />
          </div>
        </li>
      ))}
    </ul>
  );
}
