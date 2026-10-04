"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Film, Layers } from "lucide-react";
import { getAllTimelineSummaries } from "@/data/timelines";

export function TimelinesHub() {
  const timelines = getAllTimelineSummaries();

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-zinc-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#e50914_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="size-3.5" />
            <span>Interactive Universe Maps</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
            Franchise Chronological <span className="text-primary">Timelines</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Follow stories in canonical in-universe chronological order. Explore galactic eras, branching sagas, toggle Legends additions, and track your watch progress.
          </p>
        </div>
      </div>

      {/* Franchise Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelines.map((franchise) => (
            <Link
              key={franchise.slug}
              href={`/timelines/${franchise.slug}`}
              className="group relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/70 flex flex-col justify-between"
            >
              {/* Background Backdrop Glow */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10"
                />
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundColor: "#18181b",
                    backgroundImage: `radial-gradient(circle at center, ${franchise.themeColor}33 0%, #09090b 100%)`,
                  }}
                />

                {franchise.badge && (
                  <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                    {franchise.badge}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between grow">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: franchise.themeColor }}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {franchise.universe}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {franchise.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {franchise.tagline}
                  </p>
                </div>

                {/* Footer Badges & CTA */}
                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Film className="size-3.5 text-zinc-500" />
                      {franchise.itemCount} Titles
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="size-3.5 text-zinc-500" />
                      {franchise.erasCount} Eras
                    </span>
                  </div>

                  <span className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all duration-300">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
