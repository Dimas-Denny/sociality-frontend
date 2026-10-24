"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { getErrorMessage } from "@/lib/api";
import { authInputClass } from "@/features/auth/styles";
import { useUpdateProfile } from "../hooks";
import { editProfileSchema, type EditProfileFormValues } from "../schemas";
import type { MyProfile, UpdateProfilePayload } from "../types";
import { AvatarPicker } from "./avatar-picker";

export function EditProfileForm({ profile }: { profile: MyProfile }) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      avatar: undefined,
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    const payload: UpdateProfilePayload = {};
    if (dirtyFields.name) payload.name = values.name;
    if (dirtyFields.username) payload.username = values.username;
    if (dirtyFields.phone && values.phone) payload.phone = values.phone;
    if (dirtyFields.bio) payload.bio = values.bio;
    if (values.avatar) payload.avatar = values.avatar;

    updateProfile.mutate(payload, {
      onSuccess: () => {
        toast.success("Profile Success Update");
        router.replace("/me");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      // Mobile: stacked. Desktop: photo column + fields column
      className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8"
    >
      {/* Left column: photo */}
      <div className="flex flex-col items-center gap-1 md:w-40 md:shrink-0">
        <Controller
          control={control}
          name="avatar"
          render={({ field }) => (
            <AvatarPicker
              name={profile.name}
              currentUrl={profile.avatarUrl}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.avatar && (
          <p className="text-center text-sm text-accent-red">
            {errors.avatar.message}
          </p>
        )}
      </div>

      {/* Right column: fields */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <FormField id="name" label="Name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={authInputClass}
            {...register("name")}
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
            aria-invalid={!!errors.username}
            className={authInputClass}
            {...register("username")}
          />
        </FormField>

        {/* Read-only: PATCH /api/me doesn't support changing email */}
        <FormField id="email" label="Email">
          <Input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className={`${authInputClass} disabled:opacity-60`}
          />
          <p className="text-xs text-neutral-500">
            Email can&apos;t be changed
          </p>
        </FormField>

        <FormField
          id="phone"
          label="Number Phone"
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            className={authInputClass}
            {...register("phone")}
          />
        </FormField>

        <FormField id="bio" label="Bio" error={errors.bio?.message}>
          <Textarea
            id="bio"
            placeholder="Create your bio"
            aria-invalid={!!errors.bio}
            className="min-h-24 rounded-xl border-neutral-900 bg-neutral-950 px-4 py-3 text-md placeholder:text-neutral-600 focus-visible:border-primary-200 focus-visible:ring-primary-200/30 md:text-md"
            {...register("bio")}
          />
        </FormField>

        {updateProfile.isError && (
          <p role="alert" className="text-center text-sm text-accent-red">
            {getErrorMessage(updateProfile.error)}
          </p>
        )}

        <Button
          type="submit"
          disabled={!isDirty || updateProfile.isPending}
          className="h-12 w-full rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-200"
        >
          {updateProfile.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
