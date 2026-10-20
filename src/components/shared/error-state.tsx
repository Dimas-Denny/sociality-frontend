"use client";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <p className="text-md font-semibold">Oops, something went wrong</p>
      <p className="text-sm text-neutral-400">{message}</p>
      <Button
        onClick={onRetry}
        className="mt-2 h-10 rounded-full bg-primary-300 px-6 font-bold hover:bg-primary-200"
      >
        Try again
      </Button>
    </div>
  );
}
