const EMOJIS = [
  "😀",
  "😅",
  "🥰",
  "😇",
  "🙂",
  "😋",
  "🤪",
  "🤭",
  "😌",
  "🤗",
  "😪",
  "🙄",
  "🤫",
  "😴",
  "🥵",
  "😫",
  "😭",
  "😱",
];

export function EmojiPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  return (
    <div
      role="listbox"
      aria-label="Emojis"
      className="absolute bottom-full left-0 z-10 mb-2 grid w-max grid-cols-6 gap-2 rounded-xl border border-neutral-900 bg-neutral-950 p-3 shadow-xl animate-in fade-in zoom-in-95"
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          role="option"
          aria-selected={false}
          onClick={() => onSelect(emoji)}
          className="size-9 rounded-lg text-2xl transition-colors hover:bg-neutral-900"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
