"use client";

import React from "react";
import { Loader2, Calendar, History, Edit2, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { DiaryItem } from "./types";

interface DiaryTabProps {
  diary: DiaryItem[] | undefined;
  isOwner: boolean;
  deletingId: string | null;
  handleDeleteDiary: (diaryId: string) => void;
  setEditingEntry: (entry: DiaryItem) => void;
}

export function DiaryTab({
  diary,
  isOwner,
  deletingId,
  handleDeleteDiary,
  setEditingEntry,
}: DiaryTabProps) {
  if (!diary) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (diary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-8 py-20 text-center">
        <Calendar className="mb-1 h-10 w-10 text-zinc-700" />
        <p className="text-sm font-medium text-zinc-400">
          No watch entries logged yet.
        </p>
      </div>
    );
  }

  // Group diary entries by date
  const groups: { [key: string]: DiaryItem[] } = {};
  diary.forEach((entry) => {
    const dateKey = new Date(entry.watchedDate).toISOString().split("T")[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
  });

  const sortedDateKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <div className="relative ml-4 space-y-8 border-l border-zinc-800 py-4 pl-6 sm:pl-8">
      {sortedDateKeys.map((dateKey) => {
        const entries = groups[dateKey];
        const dateObj = new Date(entries[0].watchedDate);
        const dateStr = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div key={dateKey} className="relative space-y-3.5">
            {/* Day Header */}
            <div className="mb-2 flex items-center gap-2">
              <span className="border-zinc-850 rounded-full border bg-zinc-900 px-2.5 py-1 text-[10px] leading-none font-black tracking-wider text-zinc-500 uppercase shadow-inner select-none">
                {dateStr}
              </span>
              <div className="h-px flex-1 bg-zinc-900/50" />
            </div>

            {/* Watches on same day grouped closely */}
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className="group relative flex items-start gap-4 rounded-2xl border border-zinc-900/50 bg-zinc-900/10 p-4 shadow-md transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/30"
                >
                  {/* Timeline dot */}
                  <div className="border-primary ring-background absolute top-1/2 left-[-31px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 bg-zinc-950 ring-4 sm:left-[-39px]" />

                  {/* Thumbnail poster */}
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-md">
                    {entry.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${entry.posterPath}`}
                        alt={entry.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    {entry.rewatch && (
                      <div
                        className="absolute top-1 right-1 flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-600/90 p-0.5 text-white shadow"
                        title="Rewatch"
                      >
                        <History className="h-2.5 w-2.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  {/* Watch Details */}
                  <div className="min-w-0 flex-1 space-y-1.5 text-left">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                      <Link href={`/${entry.mediaType}/${entry.mediaId}`}>
                        <h3 className="cursor-pointer text-sm font-bold text-white hover:underline">
                          {entry.title}
                        </h3>
                      </Link>
                      {isOwner && (
                        <div className="flex items-center gap-1.5 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setEditingEntry(entry)}
                            className="cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
                            title="Edit Watch Log"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDiary(entry._id)}
                            disabled={deletingId === entry._id}
                            className="animate-in fade-in cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors duration-100 hover:bg-red-950/20 hover:text-red-400 disabled:opacity-50"
                            title="Delete Watch Log"
                          >
                            {deletingId === entry._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="border-zinc-850 rounded-lg border bg-zinc-900 px-2 py-0.5 text-[9px] font-bold tracking-wide text-zinc-400 uppercase">
                        {entry.mediaType} • {entry.releaseYear}
                      </span>
                      {entry.rating && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{Number(entry.rating).toFixed(0)}/10</span>
                        </div>
                      )}
                    </div>

                    {entry.review && (
                      <p className="relative mt-2 max-w-2xl rounded-xl border border-zinc-900/80 bg-zinc-950/40 p-2.5 text-xs leading-relaxed whitespace-pre-wrap text-zinc-400 italic">
                        &ldquo;{entry.review}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
