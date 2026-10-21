export function UserListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="size-12 rounded-full bg-neutral-900" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-3 w-28 rounded bg-neutral-900" />
            <div className="h-3 w-20 rounded bg-neutral-900" />
          </div>
          <div className="h-10 w-20 rounded-full bg-neutral-900" />
        </li>
      ))}
    </ul>
  );
}
