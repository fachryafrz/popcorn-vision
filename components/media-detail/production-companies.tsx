"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country?: string;
}

interface ProductionCompaniesProps {
  productionCompanies?: ProductionCompany[] | null;
  mediaType: "movie" | "tv";
}

export default function ProductionCompanies({
  productionCompanies,
  mediaType,
}: ProductionCompaniesProps) {
  if (!productionCompanies || productionCompanies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
        Production Companies
      </h3>
      <div className="flex flex-wrap gap-3">
        {productionCompanies.map((c) => (
          <Link
            key={c.id || c.name}
            href={
              c.id
                ? `/company/${c.id}`
                : `/search?type=${mediaType}&company=${encodeURIComponent(c.name)}`
            }
            title={c.name}
            className={cn(
              "group flex aspect-4/3 w-28 cursor-pointer items-center justify-center rounded-2xl p-3.5 transition-all duration-200 active:scale-95 sm:w-32 sm:p-4",
              c.logo_path
                ? "border border-white/10 bg-white/95 shadow-sm hover:bg-white"
                : "flex-col gap-1.5 border border-zinc-800/80 bg-zinc-900/60 text-center hover:border-zinc-700 hover:bg-zinc-800/80",
            )}
          >
            {c.logo_path ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/w300${c.logo_path}`}
                  alt={c.name}
                  className="max-h-full max-w-full object-contain"
                  draggable={false}
                />
                <span className="sr-only">{c.name}</span>
              </>
            ) : (
              <>
                <Building2
                  className="h-5 w-5 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-300"
                  aria-hidden="true"
                />
                <span className="line-clamp-2 text-[11px] leading-tight font-semibold text-zinc-300 transition-colors group-hover:text-white">
                  {c.name}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
