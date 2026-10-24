import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";
import { MyProfile } from "@/features/me/components/my-profile";

export const metadata: Metadata = {
  title: "My Profile | Sociality",
};

export default function MyProfilePage() {
  return (
    <AuthGuard>
      <MyProfile />
    </AuthGuard>
  );
}
