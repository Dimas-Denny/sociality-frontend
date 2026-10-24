"use client";

import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

interface DropdownProps {
  label: string; // accessible name for the trigger button
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}

// Small floating menu anchored to the right of its trigger
export function Dropdown({ label, trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useClickOutside(ref, close, open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950 p-1 shadow-xl animate-in fade-in zoom-in-95"
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

export const menuItemClass =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-neutral-900";
