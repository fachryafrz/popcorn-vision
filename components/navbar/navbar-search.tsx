"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchOverlayStore } from "@/hooks/use-search-overlay-store";
import { useIsMac } from "@/hooks/use-is-mac";

interface NavbarSearchProps {
  scrolled?: boolean;
}

export function NavbarSearch({ scrolled = false }: NavbarSearchProps) {
  const { open } = useSearchOverlayStore();
  const isMac = useIsMac();

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search movies and TV shows"
      title={
        scrolled ? `Search (${isMac ? "⌘" : "Ctrl"}+K)` : undefined
      }
      className={cn(
        "group relative hidden h-9 cursor-pointer items-center overflow-hidden rounded-full border border-zinc-800/65 bg-zinc-900/60 transition-[width,padding,background-color,border-color] duration-300 ease-out hover:border-zinc-700 hover:bg-zinc-900/90 lg:flex",
        scrolled
          ? "w-9 justify-center px-0"
          : "w-56 justify-between px-3 lg:w-72",
      )}
    >
      <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-300">
        <Search className="h-3.5 w-3.5 shrink-0" />
        {!scrolled && (
          <span className="text-xs whitespace-nowrap">
            Search movies, shows…
          </span>
        )}
      </div>

      {!scrolled && (
        <kbd className="flex shrink-0 items-center gap-0.5 rounded-md border border-zinc-800 bg-zinc-950/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 transition-colors group-hover:border-zinc-700 group-hover:text-zinc-300">
          <span>{isMac ? "⌘" : "Ctrl"}</span>
          <span>+</span>
          <span>K</span>
        </kbd>
      )}
    </button>
  );
}
