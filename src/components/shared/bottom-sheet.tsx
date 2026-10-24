"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "default" | "wide";
  children: React.ReactNode;
}

export function BottomSheet({
  open,
  onClose,
  title,
  size = "default",
  children,
}: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isWide = size === "wide";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "fixed m-0 max-h-none w-full max-w-none overflow-visible bg-transparent p-0 text-neutral-25 backdrop:bg-black/70",
        // Mobile: pinned to the bottom
        "inset-x-0 top-auto bottom-0",
        // Desktop: centered box
        "md:inset-0 md:m-auto md:h-fit",
        isWide ? "md:max-w-[min(1200px,calc(100vw-4rem))]" : "md:max-w-137",
      )}
    >
      {open && (
        <div className="relative animate-in duration-200 slide-in-from-bottom md:fade-in md:zoom-in-95 md:slide-in-from-bottom-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-12 right-4 cursor-pointer p-1 md:-top-11 md:right-0"
          >
            <X className="size-6" />
          </button>

          <section
            className={cn(
              "flex max-h-[65dvh] flex-col rounded-t-2xl border-t border-neutral-900 bg-black md:rounded-2xl md:border md:bg-neutral-950",
              isWide ? "md:max-h-none md:overflow-hidden" : "md:max-h-[80dvh]",
            )}
          >
            {children}
          </section>
        </div>
      )}
    </dialog>
  );
}
