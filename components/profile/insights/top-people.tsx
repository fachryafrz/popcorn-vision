"use client";

import React from "react";
import { User, Video, Tv2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonCount {
  name: string;
  count: number;
}

interface TopPeopleProps {
  topActors: PersonCount[];
  topDirectors: PersonCount[];
  topProviders: PersonCount[];
  onPersonClick: (name: string) => void;
}

export default function TopPeople({
  topActors,
  topDirectors,
  topProviders,
  onPersonClick,
}: TopPeopleProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Top Actors */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
        <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
          <User className="text-primary h-4 w-4" /> Top Actors
        </h4>
        <div className="space-y-3">
          {topActors.length > 0 ? (
            topActors.map((actor, idx) => (
              <div
                key={actor.name}
                onClick={() => onPersonClick(actor.name)}
                className={cn(
                  "group flex cursor-pointer items-center justify-between rounded-lg text-xs transition-all duration-200",
                )}
              >
                <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                  <span>{idx + 1}.</span>
                  <span className="group-hover:underline">{actor.name}</span>
                </span>
                <span className="font-bold text-zinc-500">
                  {actor.count} films
                </span>
              </div>
            ))
          ) : (
            <p className="text-zinc-650 text-xs italic">
              No actor metadata available.
            </p>
          )}
        </div>
      </div>

      {/* Top Directors */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
        <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
          <Video className="h-4 w-4 text-emerald-400" /> Top Directors / Creators
        </h4>
        <div className="space-y-3">
          {topDirectors.length > 0 ? (
            topDirectors.map((director, idx) => (
              <div
                key={director.name}
                onClick={() => onPersonClick(director.name)}
                className={cn(
                  "group flex cursor-pointer items-center justify-between rounded-lg text-xs transition-all duration-200",
                )}
              >
                <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                  <span>{idx + 1}.</span>
                  <span className="group-hover:underline">{director.name}</span>
                </span>
                <span className="font-bold text-zinc-500">
                  {director.count} titles
                </span>
              </div>
            ))
          ) : (
            <p className="text-zinc-650 text-xs italic">
              No director metadata available.
            </p>
          )}
        </div>
      </div>

      {/* Top Streaming Services */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
        <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
          <Tv2 className="h-4 w-4 text-amber-400" /> Top Streaming Providers
        </h4>
        <div className="space-y-3">
          {topProviders.length > 0 ? (
            topProviders.map((provider, idx) => (
              <div
                key={provider.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-zinc-300">
                  {idx + 1}. {provider.name}
                </span>
                <span className="font-bold text-zinc-500">
                  {provider.count} watches
                </span>
              </div>
            ))
          ) : (
            <p className="text-zinc-650 text-xs italic">
              No streaming provider details found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
