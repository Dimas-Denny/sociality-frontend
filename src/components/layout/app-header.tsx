"use client";

import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut, Search, User, UserPlus } from "lucide-react";
import logo from "@/assets/logo.svg";
import hamburger from "@/assets/hamburger.svg";
import { Dropdown, menuItemClass } from "@/components/shared/dropdown";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useLogout } from "@/features/auth/hooks";
import { useMe } from "@/features/me/hooks";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src={logo} alt="" width={30} height={30} priority />
        <span className="text-display-xs font-bold">Sociality</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/users/search" aria-label="Search users">
          <Search className="size-6" />
        </Link>
        <HeaderAccountMenu />
      </div>
    </header>
  );
}

export function HeaderAccountMenu() {
  const { isAuthenticated, isReady } = useAppSelector((state) => state.auth);

  // Placeholder until the token cookie is checked, avoids a hamburger flash
  if (!isReady)
    return (
      <span className="size-10 animate-pulse rounded-full bg-neutral-900" />
    );
  return isAuthenticated ? <UserMenu /> : <GuestMenu />;
}

export function UserMenu() {
  const { data } = useMe();
  const logout = useLogout();
  const profile = data?.profile;
  const name = profile?.name ?? "User";

  return (
    <Dropdown
      label="Open profile menu"
      trigger={<UserAvatar src={profile?.avatarUrl} name={name} size={40} />}
    >
      {(close) => (
        <>
          {profile && (
            <div className="border-b border-neutral-900 px-3 py-2">
              <p className="truncate text-sm font-bold">{profile.name}</p>
              <p className="truncate text-xs text-neutral-400">
                @{profile.username}
              </p>
            </div>
          )}
          <Link
            href="/me"
            role="menuitem"
            onClick={close}
            className={menuItemClass}
          >
            <User className="size-4" />
            My Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              logout();
            }}
            className={cn(menuItemClass, "text-accent-red")}
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </>
      )}
    </Dropdown>
  );
}

function GuestMenu() {
  return (
    <Dropdown
      label="Open menu"
      trigger={<Image src={hamburger} alt="" width={24} height={24} />}
    >
      {(close) => (
        <>
          <Link
            href="/login"
            role="menuitem"
            onClick={close}
            className={menuItemClass}
          >
            <LogIn className="size-4" />
            Login
          </Link>
          <Link
            href="/register"
            role="menuitem"
            onClick={close}
            className={menuItemClass}
          >
            <UserPlus className="size-4" />
            Register
          </Link>
        </>
      )}
    </Dropdown>
  );
}
