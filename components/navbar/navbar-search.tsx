"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchOverlayStore } from "@/hooks/use-search-overlay-store";
import { useIsMac } from "@/hooks/use-is-mac";

interface NavbarSearchProps {
  scrolled: boolean;
}

export function NavbarSearch({ scrolled }: NavbarSearchProps) {
  const { open } = useSearchOverlayStore();
  const isMac = useIsMac();

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "group relative hidden h-9 cursor-pointer items-center justify-between justify-self-center overflow-hidden rounded-full border border-zinc-800/65 bg-zinc-900/60 px-3 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/90 lg:flex",
        scrolled ? "w-48 lg:w-64" : "w-56 lg:w-72",
      )}
    >
      <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-300">
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Search movies, shows…</span>
      </div>

      <kbd className="flex items-center gap-0.5 rounded-md border border-zinc-800 bg-zinc-950/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 transition-colors group-hover:border-zinc-700 group-hover:text-zinc-300">
        <span>{isMac ? "⌘" : "Ctrl"}</span>
        <span>+</span>
        <span>K</span>
      </kbd>
    </button>
  );
}
