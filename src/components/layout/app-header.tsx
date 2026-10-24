"use client";

import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut, Search, User, UserPlus } from "lucide-react";
import logo from "@/assets/logo.svg";
import hamburger from "@/assets/hamburger.svg";
import { Button } from "@/components/ui/button";
import { Dropdown, menuItemClass } from "@/components/shared/dropdown";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useLogout } from "@/features/auth/hooks";
import { useMe } from "@/features/me/hooks";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { HeaderSearch } from "./header-search";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-neutral-900 bg-black px-4 md:h-20 md:px-10 lg:px-30">
      <Link href="/" className="flex shrink-0 items-center gap-3">
        <Image src={logo} alt="" width={30} height={30} priority />
        <span className="text-display-xs font-bold">Sociality</span>
      </Link>

      {/* Desktop: inline search */}
      <HeaderSearch />

      <div className="flex shrink-0 items-center gap-4">
        {/* Mobile: icon to the full-screen search page */}
        <Link
          href="/users/search"
          aria-label="Search users"
          className="md:hidden"
        >
          <Search className="size-6" />
        </Link>
        <HeaderAccountMenu />
      </div>
    </header>
  );
}

export function HeaderAccountMenu() {
  const { isAuthenticated, isReady } = useAppSelector((state) => state.auth);

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
      trigger={
        <span className="flex items-center gap-3">
          <UserAvatar src={profile?.avatarUrl} name={name} size={40} />
          {/* Desktop shows the name next to the avatar */}
          <span className="hidden max-w-40 truncate text-md font-bold md:inline">
            {name}
          </span>
        </span>
      }
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
    <>
      {/* Mobile: hamburger dropdown */}
      <div className="md:hidden">
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
      </div>

      {/* Desktop: plain buttons */}
      <div className="hidden items-center gap-3 md:flex">
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          className="h-11 w-32 rounded-full border border-neutral-900 bg-transparent text-md font-bold text-neutral-25 hover:bg-neutral-900"
        >
          Login
        </Button>
        <Button
          render={<Link href="/register" />}
          nativeButton={false}
          className="h-11 w-32 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-200"
        >
          Register
        </Button>
      </div>
    </>
  );
}
