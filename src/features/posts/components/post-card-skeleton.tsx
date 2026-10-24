export function PostCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 border-b border-neutral-900 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-neutral-900" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 rounded bg-neutral-900" />
          <div className="h-3 w-16 rounded bg-neutral-900" />
        </div>
      </div>
      <div className="aspect-square w-full rounded-md bg-neutral-900" />
      <div className="h-4 w-1/2 rounded bg-neutral-900" />
      <div className="h-4 w-3/4 rounded bg-neutral-900" />
    </div>
  );
}
