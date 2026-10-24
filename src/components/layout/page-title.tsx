"use client";

import { ArrowLeft } from "lucide-react";
import { useGoBack } from "@/hooks/use-go-back";

export function PageTitle({ title }: { title: string }) {
  const goBack = useGoBack();

  return (
    <div className="mb-6 hidden items-center gap-3 md:flex">
      <button
        type="button"
        onClick={goBack}
        aria-label="Go back"
        className="p-1"
      >
        <ArrowLeft className="size-6" />
      </button>
      <h1 className="text-display-xs font-bold">{title}</h1>
    </div>
  );
}
