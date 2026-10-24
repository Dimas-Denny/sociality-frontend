"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

interface ProfileTabsProps<T extends string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
}

export function ProfileTabs<T extends string>({
  tabs,
  active,
  onChange,
}: ProfileTabsProps<T>) {
  return (
    <div
      role="tablist"
      className="mb-4 grid border-b border-neutral-900 px-4"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={cn(
              "-mb-px flex h-12 items-center justify-center gap-2 border-b-2 text-md",
              isActive
                ? "border-neutral-25 font-bold text-neutral-25"
                : "border-transparent font-semibold text-neutral-400",
            )}
          >
            <Icon
              className="size-5 shrink-0"
              fill={isActive ? "currentColor" : "none"}
            />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
