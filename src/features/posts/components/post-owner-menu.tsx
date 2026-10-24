"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { Dropdown, menuItemClass } from "@/components/shared/dropdown";
import { cn } from "@/lib/utils";

interface PostOwnerMenuProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export function PostOwnerMenu({ onDelete, isDeleting }: PostOwnerMenuProps) {
  return (
    <Dropdown
      label="Post options"
      trigger={<MoreHorizontal className="size-6" />}
    >
      {(close) => (
        <button
          type="button"
          role="menuitem"
          disabled={isDeleting}
          onClick={() => {
            close();
            onDelete();
          }}
          className={cn(menuItemClass, "text-accent-red")}
        >
          <Trash2 className="size-4" />
          Delete Post
        </button>
      )}
    </Dropdown>
  );
}
