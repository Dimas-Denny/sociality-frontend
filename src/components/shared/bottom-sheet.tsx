"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string; // accessible name
  children: React.ReactNode;
}

// Native dialog gives focus trap, Esc to close and a backdrop for free
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll while the sheet is open
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
      onClose={onClose} // fires on Esc too
      onClick={(e) => {
        // A click on the backdrop targets the <dialog> itself
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-none w-full max-w-none overflow-visible bg-transparent p-0 text-neutral-25 backdrop:bg-black/70"
    >
      {open && (
        <div className="relative animate-in duration-200 slide-in-from-bottom">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-12 right-4 p-1"
          >
            <X className="size-6" />
          </button>

          <section className="flex max-h-[65dvh] flex-col rounded-t-2xl border-t border-neutral-900 bg-black">
            {children}
          </section>
        </div>
      )}
    </dialog>
  );
}
