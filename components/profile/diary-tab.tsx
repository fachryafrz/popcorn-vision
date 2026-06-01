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
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (diary.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-3">
        <Calendar className="h-10 w-10 text-zinc-700 mb-1" />
        <p className="text-zinc-400 text-sm font-medium">No watch entries logged yet.</p>
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
    <div className="relative border-l border-zinc-800 ml-4 pl-6 sm:pl-8 space-y-8 py-4">
      {sortedDateKeys.map((dateKey) => {
        const entries = groups[dateKey];
        const dateObj = new Date(entries[0].watchedDate);
        const dateStr = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div key={dateKey} className="space-y-3.5 relative">
            {/* Day Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-full shadow-inner leading-none select-none">
                {dateStr}
              </span>
              <div className="flex-1 h-px bg-zinc-900/50" />
            </div>

            {/* Watches on same day grouped closely */}
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className="relative group flex items-start gap-4 bg-zinc-900/10 hover:bg-zinc-900/30 p-4 border border-zinc-900/50 hover:border-zinc-800 rounded-2xl transition-all duration-300 shadow-md"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-31px] sm:left-[-39px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-zinc-950 border-2 border-primary ring-4 ring-background" />

                  {/* Thumbnail poster */}
                  <div className="relative h-20 w-14 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 shadow-md">
                    {entry.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${entry.posterPath}`}
                        alt={entry.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    {entry.rewatch && (
                      <div
                        className="absolute top-1 right-1 bg-emerald-600/90 text-white rounded-full p-0.5 shadow border border-emerald-500/30 flex items-center justify-center"
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
                        <h3 className="font-bold text-white text-sm hover:underline cursor-pointer">
                          {entry.title}
                        </h3>
                      </Link>
                      {isOwner && (
                        <div className="flex items-center gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            type="button"
                            onClick={() => setEditingEntry(entry)}
                            className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                            title="Edit Watch Log"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDiary(entry._id)}
                            disabled={deletingId === entry._id}
                            className="p-1 rounded-lg hover:bg-red-950/20 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors disabled:opacity-50 animate-in fade-in duration-100"
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
                      <span className="text-[9px] bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-lg text-zinc-400 font-bold uppercase tracking-wide">
                        {entry.mediaType} • {entry.releaseYear}
                      </span>
                      {entry.rating && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{entry.rating}/10</span>
                        </div>
                      )}
                    </div>

                    {entry.review && (
                      <p className="text-xs text-zinc-400 italic bg-zinc-950/40 border border-zinc-900/80 p-2.5 rounded-xl mt-2 leading-relaxed whitespace-pre-wrap max-w-2xl relative">
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
