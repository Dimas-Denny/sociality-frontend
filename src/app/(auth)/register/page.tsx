import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Register | Sociality",
};

export default function RegisterPage() {
  return (
    <AuthCard title="Register">
      <RegisterForm />

      <p className="mt-4 text-center text-md font-semibold">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-primary-200 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
