"use client";

import { useAuthModalStore } from "@/lib/auth-modal-store";
import { Button } from "@/components/ui/button";

interface TimelineFooterProps {
  seenCount: number;
  totalCount: number;
  isLoggedIn: boolean;
  universeDescription: string;
}

export function TimelineFooter({
  seenCount,
  totalCount,
  isLoggedIn,
}: TimelineFooterProps) {
  const openAuth = useAuthModalStore((state) => state.open);

  const percentage = totalCount > 0 ? Math.round((seenCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 bg-black border-t border-zinc-900/80 z-20 select-none">
      {/* Left: Seen Progress Tracker (Queuebrick Style) */}
      <div className="flex items-center gap-3 w-full sm:w-80">
        <span className="text-xs text-zinc-300 whitespace-nowrap">
          {"You've seen"} <strong className="text-white font-bold">{seenCount}</strong> of{" "}
          <span className="text-zinc-400">{totalCount}</span>
        </span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-zinc-400 transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Right: Informational text & Sign In CTA Button */}
      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span className="hidden lg:inline text-zinc-400 text-[11px]">
          Every film, show, and special in the order the universe lived them. Tap a cover to mark it seen. All timelines
        </span>

        {!isLoggedIn ? (
          <Button
            size="sm"
            onClick={openAuth}
            className="h-8 rounded-md bg-white px-4 text-xs font-semibold text-black hover:bg-zinc-200 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Sign up to save
          </Button>
        ) : (
          <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced</span>
          </div>
        )}
      </div>
    </div>
  );
}
