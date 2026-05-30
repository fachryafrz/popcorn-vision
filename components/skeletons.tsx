"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/20",
        className
      )}
    />
  );
}

// Fullscreen Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[85vh] sm:h-screen bg-zinc-950 flex items-end pb-12 px-6 sm:px-16 overflow-hidden">
      {/* Backdrop mockup */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
      <Skeleton className="absolute inset-0 w-full h-full rounded-none" />

      {/* Hero content */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
        {/* Poster Skeleton */}
        <Skeleton className="hidden sm:block w-48 h-72 rounded-xl flex-shrink-0 shadow-2xl shadow-black/80" />

        {/* Text Skeletons */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Badge & Rating Skeletons */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
            <Skeleton className="w-12 h-6 rounded-full" />
          </div>
          {/* Title */}
          <Skeleton className="w-3/4 h-12 rounded-lg sm:h-16" />
          {/* Overview */}
          <div className="flex flex-col gap-2 mt-2">
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-11/12 h-4 rounded" />
            <Skeleton className="w-4/5 h-4 rounded" />
          </div>
          {/* Action buttons */}
          <div className="flex gap-4 mt-6">
            <Skeleton className="w-36 h-12 rounded-full" />
            <Skeleton className="w-36 h-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Media Card Skeleton
export function CardSkeleton() {
  return (
    <div className="w-full flex-shrink-0 flex flex-col gap-3">
      {/* Poster image area */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      {/* Title & Metadata */}
      <div className="flex flex-col gap-2">
        <Skeleton className="w-11/12 h-5 rounded" />
        <div className="flex items-center justify-between">
          <Skeleton className="w-16 h-4 rounded" />
          <Skeleton className="w-10 h-4 rounded" />
        </div>
      </div>
    </div>
  );
}

// Carousel Skeleton Row
export function CarouselSkeleton({ title }: { title?: string }) {
  return (
    <div className="w-full flex flex-col gap-6 py-6 px-6 sm:px-16">
      <div className="flex justify-between items-center">
        {title ? (
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
        ) : (
          <Skeleton className="w-48 h-8 rounded" />
        )}
        <Skeleton className="w-24 h-6 rounded-full" />
      </div>

      {/* Horizontal cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
