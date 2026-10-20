import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: number; // px
  className?: string;
}

// Shows the avatar image, or the first letter of the name as a fallback
export function UserAvatar({
  src,
  name,
  size = 40,
  className,
}: UserAvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800 font-bold text-neutral-25",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span style={{ fontSize: size * 0.4 }}>
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}
