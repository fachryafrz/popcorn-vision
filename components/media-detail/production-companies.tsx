"use client";

import Link from "next/link";
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
      <div className="flex flex-wrap gap-2.5">
        {productionCompanies.map((c) => (
          <Link
            key={c.id || c.name}
            href={
              c.id
                ? `/company/${c.id}`
                : `/search?type=${mediaType}&company=${encodeURIComponent(c.name)}`
            }
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2 transition duration-200 hover:bg-zinc-800/50 active:scale-95",
            )}
          >
            {c.logo_path && (
              <div className="flex aspect-4/3 w-25 items-center justify-center rounded-lg bg-white/95 p-3 shadow-sm">
                <img
                  src={`https://image.tmdb.org/t/p/w92${c.logo_path}`}
                  alt={c.name}
                  className="max-h-full max-w-full object-contain"
                  draggable={false}
                />
              </div>
            )}
            <span
              className={cn(
                "text-xs leading-tight font-medium text-zinc-300",
                c.logo_path && "sr-only",
              )}
            >
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
