"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { PageHeader } from "@/components/layout/page-header";
import { UserMenu } from "@/components/layout/app-header";
import { getErrorMessage } from "@/lib/api";
import { useCreatePost } from "../hooks";
import { createPostSchema, type CreatePostFormValues } from "../schemas";
import { PageTitle } from "@/components/layout/page-title";

export function CreatePostForm() {
  const router = useRouter();
  const createPost = useCreatePost();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { image: undefined, caption: "" },
  });

  const onSubmit = (values: CreatePostFormValues) => {
    createPost.mutate(values, {
      onSuccess: () => {
        toast.success("Success Post");
        router.replace("/");
      },
    });
  };

  return (
    <>
      <PageHeader title="Add Post" right={<UserMenu />} />

      <main className="px-4 py-6 md:mx-auto md:max-w-113 md:px-0 md:pt-10">
        <PageTitle title="Add Post" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          {/* File input isn't a native RHF field, so we use Controller */}
          <FormField id="image" label="Photo" error={errors.image?.message}>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageDropzone
                  id="image"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.image}
                />
              )}
            />
          </FormField>

          <FormField
            id="caption"
            label="Caption"
            error={errors.caption?.message}
          >
            <Textarea
              id="caption"
              placeholder="Create your caption"
              aria-invalid={!!errors.caption}
              className="min-h-24 rounded-xl border-neutral-900 bg-neutral-950 px-4 py-3 text-sm placeholder:text-neutral-600 focus-visible:border-primary-200 focus-visible:ring-primary-200/30 md:text-sm"
              {...register("caption")}
            />
          </FormField>

          {createPost.isError && (
            <p role="alert" className="text-center text-sm text-accent-red">
              {getErrorMessage(createPost.error)}
            </p>
          )}

          <Button
            type="submit"
            disabled={createPost.isPending}
            className="h-12 w-full rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-200"
          >
            {createPost.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Share"
            )}
          </Button>
        </form>
      </main>
    </>
  );
}
