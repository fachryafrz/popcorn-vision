"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpandableTextProps {
  text: string;
  clampLines?: 1 | 2 | 3 | 4 | 5 | 6;
  threshold?: number;
  mobileOnly?: boolean;
  className?: string;
  textClassName?: string;
  buttonClassName?: string;
  moreLabel?: string;
  lessLabel?: string;
  initialExpanded?: boolean;
}

const clampClassMap: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

export function ExpandableText({
  text,
  clampLines = 3,
  threshold = 160,
  mobileOnly = true,
  className,
  textClassName,
  buttonClassName,
  moreLabel = "Read More",
  lessLabel = "Show Less",
  initialExpanded = false,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  if (!text) return null;

  const isLong = text.length > threshold;
  const baseClamp = clampClassMap[clampLines] ?? "line-clamp-3";
  const clampClass = isExpanded
    ? "line-clamp-none"
    : mobileOnly
      ? cn(baseClamp, "md:line-clamp-none")
      : baseClamp;

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <p
        className={cn(
          "leading-relaxed transition-all duration-300",
          clampClass,
          textClassName,
        )}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          aria-expanded={isExpanded}
          className={cn(
            "mt-1.5 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400",
            mobileOnly && "md:hidden",
            buttonClassName,
          )}
        >
          {isExpanded ? (
            <>
              {lessLabel} <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              {moreLabel} <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default ExpandableText;
