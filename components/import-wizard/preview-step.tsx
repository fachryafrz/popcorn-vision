"use client";

import React from "react";
import { ArrowRight, Database, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MatchedImportItem } from "@/lib/tmdb-actions";
import { LocalDuplicatesState, PlatformSource, TargetTable } from "./types";

interface PreviewStepProps {
  platform: PlatformSource;
  targetTable: TargetTable;
  onTargetTableChange: (table: TargetTable) => void;
  selectedItemIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleAll: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  resolvedItems: MatchedImportItem[];
  duplicates: LocalDuplicatesState;
  checkItemIsDuplicate: (
    item: MatchedImportItem,
    duplicates: LocalDuplicatesState,
  ) => boolean;
}

const TARGET_TABS: { id: TargetTable; label: string }[] = [
  { id: "watchlist", label: "Watchlist" },
  { id: "favorites", label: "Favorites" },
  { id: "ratings", label: "Ratings" },
  { id: "diary", label: "Diary" },
];

export default function PreviewStep({
  platform,
  targetTable,
  onTargetTableChange,
  selectedItemIds,
  onToggleSelection,
  onToggleAll,
  onCancel,
  onConfirm,
  resolvedItems,
  duplicates,
  checkItemIsDuplicate,
}: PreviewStepProps) {
  return (
    <div className="space-y-6">
      {/* Top Panel Actions info */}
      <div className="border-zinc-850 flex flex-col flex-wrap items-start justify-between gap-4 rounded-2xl border bg-zinc-900/10 p-4 md:flex-row md:items-center">
        <div className="space-y-3">
          <p className="text-xs text-zinc-400">
            Source Platform:{" "}
            <span className="font-bold text-white uppercase">{platform}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-zinc-400">
              Target Category:
            </span>
            <div className="border-zinc-850 flex items-center gap-1 rounded-xl border bg-zinc-950/60 p-1">
              {TARGET_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTargetTableChange(tab.id)}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all",
                    targetTable === tab.id
                      ? "bg-primary scale-[1.02] text-white shadow-md"
                      : "hover:text-zinc-350 text-zinc-500",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-9 cursor-pointer rounded-xl border-zinc-800 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={selectedItemIds.size === 0}
            className="h-9 cursor-pointer rounded-xl bg-white text-xs font-bold text-black hover:bg-zinc-200"
          >
            Confirm Import ({selectedItemIds.size} items)
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Matches & Duplicates Table */}
      <div className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/10 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-900/80 bg-zinc-900/10 p-4">
          <span className="text-xs font-bold text-zinc-300">
            Preview Import Items
          </span>
          <button
            onClick={onToggleAll}
            className="text-primary hover:text-primary/50 cursor-pointer text-[10px] font-bold hover:underline"
          >
            {selectedItemIds.size > 0 ? "Deselect All" : "Select All Available"}
          </button>
        </div>

        <div className="max-h-[450px] divide-y divide-zinc-900/50 overflow-y-auto">
          {resolvedItems.map((item, idx) => {
            const isSelected = selectedItemIds.has(String(idx));
            const isDuplicate = checkItemIsDuplicate(item, duplicates);

            return (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between gap-4 p-4 transition-all",
                  !item.matched ? "bg-zinc-950/40 opacity-60" : "",
                  isDuplicate ? "bg-red-950/5 opacity-80" : "",
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Thumbnail poster fallback */}
                  <div className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900">
                    {item.matched && item.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Database className="h-4.5 w-4.5 text-zinc-700" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs leading-tight font-bold text-white">
                      {item.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase">
                      <span>{item.mediaType}</span>
                      {item.releaseYear && (
                        <>
                          <span>•</span>
                          <span>{item.releaseYear}</span>
                        </>
                      )}
                      {item.rating && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-500">
                            ★ {item.rating}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkbox Status indicators */}
                <div className="flex shrink-0 items-center gap-3">
                  {isDuplicate ? (
                    <span className="flex items-center gap-1 rounded-lg border border-red-900/30 bg-red-950/20 px-2 py-1 text-[9px] font-bold text-red-400/90 uppercase">
                      <AlertTriangle className="h-3 w-3" />
                      Duplicate
                    </span>
                  ) : !item.matched ? (
                    <span className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-[9px] font-bold text-zinc-500 uppercase">
                      Unmatched
                    </span>
                  ) : (
                    <button
                      onClick={() => onToggleSelection(String(idx))}
                      className={cn(
                        "flex h-5 w-5 cursor-pointer items-center justify-center rounded-lg border transition-all",
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-zinc-800 text-transparent hover:border-zinc-700",
                      )}
                    >
                      <Check className="h-3.5 w-3.5 stroke-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
