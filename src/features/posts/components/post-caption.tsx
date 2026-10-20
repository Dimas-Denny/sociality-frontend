"use client";

import { useState } from "react";

const LONG_CAPTION = 100; // characters before we show "Show More"

export function PostCaption({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > LONG_CAPTION;

  return (
    <div>
      <p
        className={`text-sm whitespace-pre-line ${!expanded && isLong ? "line-clamp-2" : ""}`}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-bold text-primary-200"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
