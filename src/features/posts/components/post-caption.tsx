"use client";

import { useState } from "react";

const LONG_CAPTION = 100; // characters before we show "Show More"

interface PostCaptionProps {
  text: string;
  alwaysExpanded?: boolean;
}

export function PostCaption({
  text,
  alwaysExpanded = false,
}: PostCaptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = !alwaysExpanded && text.length > LONG_CAPTION;

  return (
    <div>
      <p
        className={`text-sm whitespace-pre-line ${isLong && !expanded ? "line-clamp-2" : ""}`}
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
