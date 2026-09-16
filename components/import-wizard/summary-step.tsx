"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { SummaryStats } from "./types";

interface SummaryStepProps {
  summaryStats: SummaryStats;
  onReset: () => void;
}

export default function SummaryStep({
  summaryStats,
  onReset,
}: SummaryStepProps) {
  const STAT_CONFIG = [
    {
      label: "Watchlist",
      value: summaryStats.watchlist,
      color: "text-primary",
    },
    {
      label: "Favorites",
      value: summaryStats.favorites,
      color: "text-purple-400",
    },
    {
      label: "Ratings",
      value: summaryStats.ratings,
      color: "text-yellow-400",
    },
    {
      label: "Diary",
      value: summaryStats.diary,
      color: "text-emerald-400",
    },
    {
      label: "Duplicates",
      value: summaryStats.duplicates,
      color: "text-zinc-500",
    },
    {
      label: "Unmatched",
      value: summaryStats.skipped,
      color: "text-red-400/70",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl border border-zinc-900 bg-zinc-950/20 p-6 text-center shadow-xl md:p-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
          <div>
            <h3 className="mb-1 text-lg font-black text-zinc-200">
              Import Summary List
            </h3>
            <p className="text-xs text-zinc-500">
              Your data has been successfully processed and synced with{" "}
              {siteConfig.name} database.
            </p>
          </div>
        </div>

        {/* Results Grid counts */}
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
          {STAT_CONFIG.map((stat, i) => (
            <div
              key={i}
              className="flex min-h-20 flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-900/40 p-3 sm:min-h-24 sm:p-4"
            >
              <span className="block text-[10px] leading-tight font-black tracking-wide text-zinc-500 uppercase">
                {stat.label}
              </span>
              <span className={cn("mt-2 block text-2xl font-black", stat.color)}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto flex w-full max-w-xs flex-col items-center justify-center gap-3 pt-6 sm:max-w-md sm:flex-row">
          <Button
            onClick={onReset}
            variant="outline"
            className="h-11 w-full cursor-pointer rounded-xl border-zinc-800 text-xs font-semibold sm:w-1/2"
          >
            Import Another File
          </Button>
          <Button
            onClick={onReset}
            className="h-11 w-full cursor-pointer rounded-xl bg-white text-xs font-bold text-black shadow-md hover:bg-zinc-200 sm:w-1/2"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
