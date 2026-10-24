import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";
import { EditProfile } from "@/features/me/components/edit-profile";

export const metadata: Metadata = {
  title: "Edit Profile | Sociality",
};

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <EditProfile />
    </AuthGuard>
  );
}
