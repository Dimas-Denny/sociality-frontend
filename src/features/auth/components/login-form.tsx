"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/shared/password-input";
import { getErrorMessage } from "@/lib/api";
import { useLogin } from "../hooks";
import { loginSchema, type LoginFormValues } from "../schemas";
import { authInputClass } from "../styles";

function getSafeReturnTo(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => {
        router.replace(getSafeReturnTo(searchParams.get("returnTo")));
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Email */}
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="email" className="text-sm font-bold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={!!errors.email}
          className={authInputClass}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-accent-red">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="password" className="text-sm font-bold">
          Password
        </Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          className={authInputClass}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-accent-red">{errors.password.message}</p>
        )}
      </div>

      {/* Server error */}
      {login.isError && (
        <p role="alert" className="text-center text-sm text-accent-red">
          {getErrorMessage(login.error)}
        </p>
      )}

      <Button
        type="submit"
        disabled={login.isPending}
        className="h-12 w-full rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-200"
      >
        {login.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
