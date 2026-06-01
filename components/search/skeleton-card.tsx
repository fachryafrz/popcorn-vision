import React from "react";

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-2/3 w-full rounded-2xl bg-zinc-800" />
      <div className="h-4 rounded bg-zinc-800 w-3/4" />
      <div className="h-3 rounded bg-zinc-800/60 w-1/2" />
    </div>
  );
}

export function UserSkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="h-14 w-14 rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-zinc-800 rounded w-full" />
      <div className="h-3 bg-zinc-800 rounded w-5/6" />
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="h-9 bg-zinc-800 rounded-xl" />
        <div className="h-9 bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}
