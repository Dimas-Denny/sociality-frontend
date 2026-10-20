"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface PostImageProps {
  src: string;
  alt: string;
}

// Square post image with a placeholder if it fails to load (PDF: missing media)
export function PostImage({ src, alt }: PostImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-neutral-900">
      {failed ? (
        <div className="flex h-full items-center justify-center text-neutral-600">
          <ImageOff className="size-10" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
