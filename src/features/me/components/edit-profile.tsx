"use client";

import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { UserMenu } from "@/components/layout/app-header";
import { getErrorMessage } from "@/lib/api";
import { useMe } from "../hooks";
import { EditProfileForm } from "./edit-profile-form";
import { PageTitle } from "@/components/layout/page-title";

export function EditProfile() {
  const { data, isLoading, isError, error, refetch } = useMe();

  return (
    <>
      <PageHeader title="Edit Profile" right={<UserMenu />} />

      <main className="px-4 py-6 md:mx-auto md:max-w-200 md:px-0 md:pt-10">
        <PageTitle title="Edit Profile" />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-neutral-400" />
          </div>
        ) : isError || !data ? (
          <ErrorState
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
          />
        ) : (
          <EditProfileForm profile={data.profile} />
        )}
      </main>
    </>
  );
}
