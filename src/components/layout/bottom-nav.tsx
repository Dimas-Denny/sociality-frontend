"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Plus, User, type LucideIcon } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Private destinations go through Login (with return-to) when logged out
  const protect = (href: string) =>
    isAuthenticated ? href : `/login?returnTo=${encodeURIComponent(href)}`;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-4 bottom-4 z-40 flex h-16 items-center justify-around rounded-full border border-neutral-900 bg-neutral-950/90 backdrop-blur-md md:inset-x-auto md:bottom-8 md:left-1/2 md:w-90 md:-translate-x-1/2"
    >
      <NavItem href="/" label="Home" icon={House} active={pathname === "/"} />

      <Link
        href={protect("/posts/new")}
        aria-label="Create post"
        className="flex size-12 items-center justify-center rounded-full bg-primary-300 transition-colors hover:bg-primary-200"
      >
        <Plus className="size-6" />
      </Link>

      <NavItem
        href={protect("/me")}
        label="Profile"
        icon={User}
        active={pathname.startsWith("/me")}
      />
    </nav>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}

function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center text-xs font-semibold",
        active ? "text-primary-200" : "text-neutral-25",
      )}
    >
      <Icon className="size-6" fill={active ? "currentColor" : "none"} />
      {label}
    </Link>
  );
}
