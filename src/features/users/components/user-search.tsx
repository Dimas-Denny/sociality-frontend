"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleX, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useDebounce } from "@/hooks/use-debounce";
import { useOnVisible } from "@/hooks/use-on-visible";
import { getErrorMessage } from "@/lib/api";
import { useUserSearch } from "../hooks";
import { UserListItem } from "./user-list-item";
import { UserListSkeleton } from "./user-list-skeleton";

export function UserSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword.trim(), 400);

  const {
    users,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUserSearch(debouncedKeyword);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useOnVisible<HTMLDivElement>(
    loadMore,
    Boolean(hasNextPage),
  );

  // Go back if the user came from inside the app, otherwise go home
  const handleClose = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const renderResults = () => {
    if (!debouncedKeyword) {
      return (
        <EmptyState
          title="Find people"
          description="Search by name or username."
        />
      );
    }
    if (isLoading) return <UserListSkeleton />;
    if (isError) {
      return (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      );
    }
    if (users.length === 0) {
      return (
        <EmptyState
          title="No users found"
          description={`No results for "${debouncedKeyword}".`}
        />
      );
    }
    return (
      <>
        <ul className="py-1">
          {users.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </ul>
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="size-6 animate-spin text-neutral-400" />
          )}
        </div>
      </>
    );
  };

  return (
    <main className="min-h-dvh">
      <div className="sticky top-0 z-40 flex items-center gap-4 border-b border-neutral-900 bg-black px-4 py-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-500" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search"
            aria-label="Search users"
            inputMode="search"
            enterKeyHint="search"
            autoFocus
            className="h-10 rounded-full border-neutral-900 bg-neutral-950 pr-11 pl-11 text-sm placeholder:text-neutral-600 focus-visible:border-primary-200 focus-visible:ring-primary-200/30 md:text-sm"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              <CircleX className="size-5 fill-neutral-500 text-neutral-950" />
            </button>
          )}
        </div>

        <button type="button" onClick={handleClose} aria-label="Close search">
          <X className="size-6" />
        </button>
      </div>

      {renderResults()}
    </main>
  );
}
