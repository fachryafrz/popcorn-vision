"use client";

import React from "react";
import { Film, Tv, Clock, Star } from "lucide-react";
import { StatsData } from "./types";

interface StatCardsProps {
  stats: StatsData;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
            Movies
          </span>
          <Film className="text-primary h-5 w-5" />
        </div>
        <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
          {stats.moviesCount}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">watched</p>
      </div>

      <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
            TV Series
          </span>
          <Tv className="h-5 w-5 text-emerald-500" />
        </div>
        <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
          {stats.tvSeriesCount}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          {stats.tvSeasonsCount}{" "}
          {stats.tvSeasonsCount === 1 ? "season" : "seasons"} ·{" "}
          {stats.tvEpisodesCount}{" "}
          {stats.tvEpisodesCount === 1 ? "episode" : "episodes"}
        </p>
      </div>

      <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
            Time
          </span>
          <Clock className="h-5 w-5 text-amber-500" />
        </div>
        <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
          {stats.hoursWatched}{" "}
          <span className="text-lg font-bold text-zinc-500">hrs</span>
        </h3>
        <p className="mt-1 text-xs text-zinc-500">total watch time</p>
      </div>

      <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
            Avg Rating
          </span>
          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
        </div>
        <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
          {stats.averageRating}{" "}
          <span className="text-lg font-bold text-zinc-500">/10</span>
        </h3>
        <p className="mt-1 text-xs text-zinc-500">across rated items</p>
      </div>
    </div>
  );
}
