"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, right }: PageHeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-neutral-900 bg-black px-4">
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
  );
}
