"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";
import { getErrorMessage } from "@/lib/api";
import { useRegister } from "../hooks";
import { registerSchema, type RegisterFormValues } from "../schemas";
import { authInputClass } from "../styles";
import { FormField } from "./form-field";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = ({ confirmPassword: _, ...payload }: RegisterFormValues) => {
    // confirmPassword is UI-only, the API doesn't accept it
    registerMutation.mutate(payload, {
      // Register returns a token, so the user is already logged in
      onSuccess: () => router.replace("/feed"),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <FormField id="name" label="Name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Enter your name"
          aria-invalid={!!errors.name}
          className={authInputClass}
          {...register("name")}
        />
      </FormField>

      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={!!errors.email}
          className={authInputClass}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="username"
        label="Username"
        error={errors.username?.message}
      >
        <Input
          id="username"
          autoComplete="username"
          placeholder="Enter your username"
          aria-invalid={!!errors.username}
          className={authInputClass}
          {...register("username")}
        />
      </FormField>

      <FormField id="phone" label="Number Phone" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric" // numeric keyboard on mobile
          autoComplete="tel"
          placeholder="Enter your number phone"
          aria-invalid={!!errors.phone}
          className={authInputClass}
          {...register("phone")}
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          className={authInputClass}
          {...register("password")}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Enter your confirm password"
          aria-invalid={!!errors.confirmPassword}
          className={authInputClass}
          {...register("confirmPassword")}
        />
      </FormField>

      {/* Server error, e.g. duplicate email/username */}
      {registerMutation.isError && (
        <p role="alert" className="text-center text-sm text-accent-red">
          {getErrorMessage(registerMutation.error)}
        </p>
      )}

      <Button
        type="submit"
        disabled={registerMutation.isPending}
        className="h-12 w-full rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-200"
      >
        {registerMutation.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}
