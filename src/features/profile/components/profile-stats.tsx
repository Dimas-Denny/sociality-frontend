import Link from "next/link";

export interface StatItem {
  label: string;
  value: number;
  href?: string; // e.g. followers list
}

export function ProfileStats({ items }: { items: StatItem[] }) {
  return (
    <ul className="grid grid-cols-4 divide-x divide-neutral-900 px-4 py-4">
      {items.map(({ label, value, href }) => {
        const content = (
          <>
            <span className="text-lg font-bold">{value}</span>
            <span className="text-xs text-neutral-400">{label}</span>
          </>
        );
        return (
          <li key={label}>
            {href ? (
              <Link href={href} className="flex flex-col items-center">
                {content}
              </Link>
            ) : (
              <div className="flex flex-col items-center">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
