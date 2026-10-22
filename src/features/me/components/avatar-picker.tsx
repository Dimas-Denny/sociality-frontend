"use client";

import { useEffect, useMemo, useRef } from "react";
import { UserAvatar } from "@/components/shared/user-avatar";

interface AvatarPickerProps {
  name: string;
  currentUrl: string | null;
  value?: File;
  onChange: (file?: File) => void;
}

export function AvatarPicker({
  name,
  currentUrl,
  value,
  onChange,
}: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Preview the newly picked file, otherwise show the current avatar
  const previewUrl = useMemo(
    () =>
      value && value.type.startsWith("image/")
        ? URL.createObjectURL(value)
        : null,
    [value],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      <UserAvatar src={previewUrl ?? currentUrl} name={name} size={80} />

      <input
        ref={inputRef}
        id="avatar"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
          e.target.value = ""; // allow picking the same file again
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-10 rounded-full border border-neutral-900 px-6 text-sm font-bold transition-colors hover:bg-neutral-900"
      >
        Change Photo
      </button>
    </div>
  );
}
