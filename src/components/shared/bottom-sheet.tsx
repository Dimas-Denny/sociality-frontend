"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string; // accessible name
  children: React.ReactNode;
}

// Mobile: sheet from the bottom. Desktop (md+): centered modal.
// Native <dialog> gives us focus trap, Esc to close and a backdrop for free.
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync React state -> native dialog
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
      className={[
        "fixed m-0 max-h-none w-full max-w-none overflow-visible bg-transparent p-0 text-neutral-25 backdrop:bg-black/70",
        "inset-x-0 top-auto bottom-0",
        "md:inset-0 md:m-auto md:h-fit md:max-w-137",
      ].join(" ")}
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

          <section className="flex max-h-[65dvh] flex-col rounded-t-2xl border-t border-neutral-900 bg-black md:max-h-[80dvh] md:rounded-2xl md:border md:bg-neutral-950">
            {children}
          </section>
        </div>
      )}
    </dialog>
  );
}
