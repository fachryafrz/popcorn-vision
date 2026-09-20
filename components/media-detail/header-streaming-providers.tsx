"use client";

import { useState } from "react";
import Link from "next/link";
import { Tv } from "lucide-react";
import RegionSelect from "@/components/region-select";
import { ProviderItem } from "./types";

interface HeaderStreamingProvidersProps {
  mediaType: "movie" | "tv";
  providers: ProviderItem[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

export default function HeaderStreamingProviders({
  mediaType,
  providers,
  selectedRegion,
  setSelectedRegion,
}: HeaderStreamingProvidersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasProviders = providers.length > 0;
  const displayedProviders = isExpanded ? providers : providers.slice(0, 6);

  return (
    <div className="mb-4 flex flex-col gap-2.5 text-xs text-zinc-300">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-400">
          <Tv
            className={
              hasProviders
                ? "text-primary h-3.5 w-3.5"
                : "h-3.5 w-3.5 text-zinc-500"
            }
          />
          <span>{hasProviders ? "Available on:" : "Not streaming in"}</span>
        </div>

        {/* Mini Region Selector Pill */}
        <RegionSelect
          value={selectedRegion}
          onValueChange={(val) => {
            setSelectedRegion(val || "US");
            setIsExpanded(false);
          }}
          mode="code"
          variant="compact"
          placeholder="Region"
        />
      </div>

      {hasProviders && (
        <div className="flex flex-wrap items-center gap-2">
          {displayedProviders.map((prov) => (
            <Link
              key={prov.provider_id}
              href={`/search?type=${mediaType}&providerId=${prov.provider_id}`}
              className="group hover:shadow-primary/20 relative flex h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-sm transition-all duration-200 hover:scale-110 hover:border-zinc-500 hover:shadow-md active:scale-95"
              title={`Available on ${prov.provider_name}`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${prov.logo_path}`}
                alt={prov.provider_name}
                className="h-full w-full object-cover"
              />
            </Link>
          ))}
          {providers.length > 6 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex h-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 px-2.5 text-xs font-bold text-zinc-400 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-95"
              title={isExpanded ? "Show fewer providers" : `Show all (${providers.length}) providers`}
            >
              {isExpanded ? "Less" : `+${providers.length - 6}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
