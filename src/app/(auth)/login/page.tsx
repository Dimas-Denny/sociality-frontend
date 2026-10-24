import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login | Sociality",
};

export default function LoginPage() {
  return (
    <AuthCard title="Welcome Back!">
      {/* useSearchParams() in LoginForm requires a Suspense boundary */}
      <Suspense>
        <LoginForm />
      </Suspense>

      <p className="mt-4 text-center text-sm font-semibold md:text-md">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-primary-200 hover:underline"
        >
          Register
        </Link>
      </p>
    </AuthCard>
  );
}
