import type { Metadata } from "next";
import { UserSearch } from "@/features/users/components/user-search";

export const metadata: Metadata = {
  title: "Search Users | Sociality",
};

export default function SearchUsersPage() {
  return <UserSearch />;
}
