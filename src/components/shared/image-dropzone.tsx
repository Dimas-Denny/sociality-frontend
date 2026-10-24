"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CloudUpload, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  id: string;
  value?: File;
  onChange: (file?: File) => void;
  invalid?: boolean;
}

export function ImageDropzone({
  id,
  value,
  onChange,
  invalid,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onChange(file);
  };

  const hiddenInput = (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept="image/png,image/jpeg,image/webp"
      aria-invalid={invalid}
      className="sr-only"
      onChange={(e) => {
        handleFiles(e.target.files);
        e.target.value = ""; // allow picking the same file again
      }}
    />
  );

  // Preview state
  if (previewUrl) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-neutral-900 bg-neutral-950 p-4">
        {hiddenInput}
        {/* Blob URL preview — next/image isn't needed for a local file */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Selected photo preview"
          className="max-h-80 w-full rounded-md object-contain"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={openPicker}
            className="flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-3 text-sm font-semibold transition-colors hover:bg-neutral-800"
          >
            <Upload className="size-4" />
            Change Image
          </button>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-3 text-sm font-semibold text-accent-red transition-colors hover:bg-neutral-800"
          >
            <Trash2 className="size-4" />
            Delete Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {hiddenInput}
      <button
        type="button"
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault(); // required so onDrop fires
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center gap-1 rounded-xl border bg-neutral-950 px-6 py-6 transition-colors",
          invalid && "border-dashed border-accent-red",
          isDragging && "border-dashed border-primary-200 bg-neutral-900",
          !invalid && !isDragging && "border-neutral-900",
        )}
      >
        <span className="mb-2 flex size-10 items-center justify-center rounded-lg border border-neutral-900">
          <CloudUpload className="size-5" />
        </span>
        <span className="text-sm">
          <span className="font-bold text-primary-200">Click to upload</span>
          <span className="text-neutral-600"> or drag and drop</span>
        </span>
        <span className="text-sm text-neutral-600">PNG or JPG (max. 5mb)</span>
      </button>
    </>
  );
}
