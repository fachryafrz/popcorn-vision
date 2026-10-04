import React from "react";
import { ChangelogType } from "@/data/changelog";
import { cn } from "@/lib/utils";

interface ChangelogBadgeProps {
  type: ChangelogType;
  className?: string;
}

const TYPE_CONFIG: Record<
  ChangelogType,
  { label: string; className: string }
> = {
  feat: {
    label: "Feature",
    className:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  fix: {
    label: "Fix",
    className:
      "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
  },
  perf: {
    label: "Performance",
    className:
      "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
  },
  refactor: {
    label: "Refactor",
    className:
      "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  },
  ui: {
    label: "UI",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  },
};

export function ChangelogBadge({ type, className }: ChangelogBadgeProps) {
  const config = TYPE_CONFIG[type];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-colors",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
