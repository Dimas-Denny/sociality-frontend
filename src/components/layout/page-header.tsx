"use client";

import { ArrowLeft } from "lucide-react";
import { useGoBack } from "@/hooks/use-go-back";
import { AppHeader } from "./app-header";

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, right }: PageHeaderProps) {
  const goBack = useGoBack();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-neutral-900 bg-black px-4 md:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="p-1"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="truncate text-md font-bold">{title}</h1>
        </div>
        {right}
      </header>

      <AppHeader className="hidden md:flex" />
    </>
  );
}
