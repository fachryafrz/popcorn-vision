import React from "react";

export function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="aspect-2/3 w-full rounded-2xl bg-zinc-800" />
      <div className="h-4 w-3/4 rounded bg-zinc-800" />
      <div className="h-3 w-1/2 rounded bg-zinc-800/60" />
    </div>
  );
}

export function UserSkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-zinc-800/60" />
        </div>
      </div>
      <div className="h-3 w-full rounded bg-zinc-800" />
      <div className="h-3 w-5/6 rounded bg-zinc-800" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="h-9 rounded-xl bg-zinc-800" />
        <div className="h-9 rounded-xl bg-zinc-800" />
      </div>
    </div>
  );
}
