"use client";

import { useCallback, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useAddComment } from "../hooks";
import { commentSchema, type CommentFormValues } from "../schemas";
import { EmojiPicker } from "./emoji-picker";

export function CommentComposer({ postId }: { postId: number }) {
  const addComment = useAddComment(postId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const closePicker = useCallback(() => setPickerOpen(false), []);
  useClickOutside(pickerRef, closePicker, pickerOpen);

  const { register, handleSubmit, reset, setValue, getValues, control } =
    useForm<CommentFormValues>({
      resolver: zodResolver(commentSchema),
      defaultValues: { text: "" },
    });

  const text = useWatch({ control, name: "text" });
  const canPost = text.trim().length > 0;

  // Share the input element between RHF and our own ref (for cursor position)
  const { ref: registerRef, ...textField } = register("text");

  // Insert the emoji where the cursor is, not just at the end
  const insertEmoji = (emoji: string) => {
    const input = inputRef.current;
    const current = getValues("text");
    const start = input?.selectionStart ?? current.length;
    const end = input?.selectionEnd ?? current.length;

    setValue("text", current.slice(0, start) + emoji + current.slice(end));

    requestAnimationFrame(() => {
      const cursor = start + emoji.length;
      input?.focus();
      input?.setSelectionRange(cursor, cursor);
    });
  };

  const onSubmit = ({ text }: CommentFormValues) => {
    addComment.mutate(text);
    reset();
    setPickerOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 border-t border-neutral-900 p-4"
    >
      <div ref={pickerRef} className="relative">
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          aria-label="Add emoji"
          aria-expanded={pickerOpen}
          className="flex size-12 items-center justify-center rounded-xl border border-neutral-900 transition-colors hover:bg-neutral-900"
        >
          <Smile className="size-6" />
        </button>
        {pickerOpen && <EmojiPicker onSelect={insertEmoji} />}
      </div>

      <div className="relative flex-1">
        <Input
          {...textField}
          id="comment-input"
          ref={(element) => {
            registerRef(element);
            inputRef.current = element;
          }}
          placeholder="Add Comment"
          aria-label="Add a comment"
          autoComplete="off"
          maxLength={500}
          className="h-12 rounded-xl border-neutral-900 bg-neutral-950 pr-16 pl-4 text-sm placeholder:text-neutral-600 focus-visible:border-primary-200 focus-visible:ring-primary-200/30 md:text-sm"
        />
        <button
          type="submit"
          disabled={!canPost}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-primary-200 disabled:text-neutral-600"
        >
          Post
        </button>
      </div>
    </form>
  );
}
