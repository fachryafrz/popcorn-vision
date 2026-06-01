"use client";

import { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Search } from "lucide-react";
import regionsData from "@/data/iso-3166.json";

// Typed interface matching the JSON shape
interface RegionItem {
  name: string;
  "alpha-2": string;
  "alpha-3": string;
  "country-code": string;
  "iso_3166-2": string;
  region: string;
  "sub-region": string;
  "intermediate-region": string;
  "region-code": string;
  "sub-region-code": string;
  "intermediate-region-code": string;
}

// Strictly cast the imported JSON data
const regions: RegionItem[] = regionsData as RegionItem[];

interface RegionSelectProps {
  value: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  mode?: "code" | "name"; // "code" uses alpha-2 (e.g., 'US'), "name" uses full name (e.g., 'United States')
}

// Dynamic country flag emoji generation
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

export default function RegionSelect({
  value,
  onValueChange,
  placeholder = "Select your region",
  className,
  mode = "code",
}: RegionSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Memoized exact or partial matching region for display label
  const selectedRegion = useMemo(() => {
    return regions.find((r) =>
      mode === "code"
        ? r["alpha-2"].toUpperCase() === value.toUpperCase()
        : r.name.toLowerCase() === value.toLowerCase(),
    );
  }, [value, mode]);

  // Memoized filter list of regions by search query
  const filteredRegions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return regions;
    return regions.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r["alpha-2"].toLowerCase().includes(query) ||
        r["alpha-3"].toLowerCase().includes(query),
    );
  }, [search]);

  const displayLabel = selectedRegion
    ? `${getFlagEmoji(selectedRegion["alpha-2"])} ${selectedRegion.name}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 text-left text-xs font-bold text-zinc-300 outline-hidden transition-all duration-200 select-none hover:text-white focus:border-blue-500/50 focus:bg-zinc-900",
          className,
        )}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="border-zinc-850 z-50 w-[280px] origin-top overflow-hidden rounded-2xl border bg-zinc-950/95 p-0 text-white shadow-2xl backdrop-blur-md sm:w-[320px]"
      >
        {/* Sticky Search Header */}
        <div className="relative flex items-center gap-2 border-b border-zinc-900 bg-zinc-950/40 p-2.5">
          <Search className="absolute left-5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search region or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-900 bg-zinc-950 py-2 pr-3 pl-8 text-xs text-white placeholder-zinc-600 outline-hidden transition-all focus:border-blue-500/30"
          />
        </div>

        {/* Scrollable list */}
        <div className="max-h-64 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent space-y-0.5 overflow-y-auto p-1.5">
          {filteredRegions.map((region) => {
            const itemValue = mode === "code" ? region["alpha-2"] : region.name;
            const isSelected =
              mode === "code"
                ? value.toUpperCase() === region["alpha-2"].toUpperCase()
                : value.toLowerCase() === region.name.toLowerCase();

            return (
              <button
                key={region["alpha-2"]}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onValueChange(itemValue);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all",
                  isSelected
                    ? "border border-blue-500/20 bg-blue-600/10 text-blue-400"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white",
                )}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <span className="shrink-0 text-sm leading-none select-none">
                    {getFlagEmoji(region["alpha-2"])}
                  </span>
                  <span className="truncate">{region.name}</span>
                </span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                )}
              </button>
            );
          })}
          {filteredRegions.length === 0 && (
            <div className="text-zinc-650 py-6 text-center text-xs font-bold italic">
              No matching regions found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
