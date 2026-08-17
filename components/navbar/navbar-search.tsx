"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarSearchProps {
  scrolled: boolean;
}

export function NavbarSearch({ scrolled }: NavbarSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [searchValue, setSearchValue] = useState(q);
  const [prevQ, setPrevQ] = useState(q);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (q !== prevQ) {
    setPrevQ(q);
    setSearchValue(q);
  }

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  const handleSearchClear = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="hidden items-center justify-self-center lg:flex"
    >
      <div
        className={cn(
          "relative flex h-9 items-center overflow-hidden rounded-full border border-zinc-800/65 bg-zinc-900/60 transition-all duration-300",
          scrolled ? "w-48 lg:w-64" : "w-56 lg:w-72",
          isSearchFocused
            ? "border-zinc-700/80 bg-zinc-900/90 ring-1 ring-zinc-800"
            : "bg-zinc-900/40",
        )}
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          ref={searchInputRef}
          id="navbar-search"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Search movies, shows…"
          className="w-full bg-transparent pr-7 pl-8 text-xs text-white outline-none placeholder:text-zinc-500"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleSearchClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-zinc-500 transition-colors hover:text-white"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
