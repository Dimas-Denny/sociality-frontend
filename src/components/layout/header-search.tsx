"use client";

import { useCallback, useRef, useState } from "react";
import { CircleX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useDebounce } from "@/hooks/use-debounce";
import { useUserSearch } from "@/features/users/hooks";
import { UserListItem } from "@/features/users/components/user-list-item";
import { UserListSkeleton } from "@/features/users/components/user-list-skeleton";

const MAX_RESULTS = 8;

// Desktop only: inline search with a results dropdown (mobile uses /users/search)
export function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const debouncedKeyword = useDebounce(keyword.trim(), 400);
  const { users, isLoading } = useUserSearch(debouncedKeyword);

  const clear = () => {
    setKeyword("");
    inputRef.current?.focus();
  };

  return (
    <div ref={ref} className="relative hidden w-full max-w-[491px] md:block">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-500" />
      <Input
        ref={inputRef}
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search"
        aria-label="Search users"
        className="h-12 rounded-full border-neutral-900 bg-neutral-950 pr-11 pl-11 text-sm placeholder:text-neutral-600 focus-visible:border-primary-200 focus-visible:ring-primary-200/30 md:text-sm"
      />

      {keyword && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <CircleX className="size-5 fill-neutral-500 text-neutral-950" />
        </button>
      )}

      {open && debouncedKeyword && (
        // Clicking a result navigates away, so close the panel too
        <div
          onClick={close}
          className="absolute top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-2xl border border-neutral-900 bg-neutral-950 py-2 shadow-xl animate-in fade-in"
        >
          {isLoading ? (
            <UserListSkeleton count={3} />
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-bold">No results found</p>
              <p className="text-xs text-neutral-400">Change your keyword</p>
            </div>
          ) : (
            <ul className="px-4">
              {users.slice(0, MAX_RESULTS).map((user) => (
                <UserListItem key={user.id} user={user} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
