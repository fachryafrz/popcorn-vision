"use client";

import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md border border-zinc-700/20 bg-zinc-800/60 backdrop-blur-sm",
        className,
      )}
    />
  );
}

// Fullscreen Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="relative flex h-[90svh] w-full items-end overflow-hidden bg-zinc-950 px-6 pb-16 sm:h-svh sm:px-16 sm:pb-24 md:px-20">
      {/* Backdrop mockup */}
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-black/10" />
      <div className="absolute inset-0 z-10 hidden bg-linear-to-r from-zinc-950/80 via-transparent to-transparent md:block" />

      {/* Hero content */}
      <div className="relative z-20 flex w-full max-w-5xl flex-col items-end gap-8 md:flex-row md:gap-10">
        {/* Poster Skeleton (hidden on mobile, visible on desktop) */}
        <div className="hidden h-76 w-52 shrink-0 rounded-2xl border border-zinc-700/30 shadow-2xl shadow-black/85 lg:block">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>

        {/* Text Skeletons */}
        <div className="flex w-full flex-1 flex-col items-start gap-4 text-left">
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-xl" />
            <Skeleton className="h-6 w-20 rounded-xl" />
            <Skeleton className="h-6 w-16 rounded-xl" />
          </div>

          {/* Title Placeholder */}
          <Skeleton className="h-12 w-3/4 rounded-lg sm:h-16 md:h-20" />

          {/* Meta rows (TV/Movie type, Rating, Year) */}
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-5 w-12 rounded" />
          </div>

          {/* Overview text lines */}
          <div className="mt-1 flex w-full max-w-2xl flex-col gap-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>

          {/* Action buttons (View Details, Watchlist, Favorite) */}
          <div className="mt-6 flex items-center gap-4">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full sm:w-36" />
            <Skeleton className="h-12 w-12 rounded-full sm:w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Media Card Skeleton
export function CardSkeleton() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-3">
      {/* Poster image area */}
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-900">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      {/* Title & Metadata */}
      <div className="flex flex-col gap-1 px-1">
        <Skeleton className="h-5 w-11/12 rounded" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

// Carousel Skeleton Row
export function CarouselSkeleton() {
  return (
    <div className="swiper-carousel-container relative w-full">
      <Swiper
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 24 },
          768: { slidesPerView: 4, spaceBetween: 24 },
          1024: { slidesPerView: 5, spaceBetween: 24 },
          1280: { slidesPerView: 6, spaceBetween: 24 },
        }}
        className="w-full pb-4"
        allowTouchMove={false}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SwiperSlide key={i} className="py-1">
            <CardSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// Continue Watching Card Skeleton
export function ContinueWatchingCardSkeleton() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-3">
      {/* Backdrop area (Landscape) */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-900">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      {/* Info / Metadata */}
      <div className="flex flex-col gap-1.5 px-1">
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="bg-primary/25 h-3.5 w-1/3 rounded-sm" />
        <Skeleton className="h-3 w-1/2 rounded-sm" />
      </div>
    </div>
  );
}

// Continue Watching Carousel Skeleton Row
export function ContinueWatchingCarouselSkeleton() {
  return (
    <div className="swiper-carousel-container relative w-full">
      <Swiper
        spaceBetween={16}
        slidesPerView={1.3}
        breakpoints={{
          640: { slidesPerView: 1.2, spaceBetween: 20 },
          768: { slidesPerView: 2.7, spaceBetween: 24 },
          1024: { slidesPerView: 3.7, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="w-full pb-4"
        allowTouchMove={false}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SwiperSlide key={i} className="py-1">
            <ContinueWatchingCardSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// Media Detail Page Skeleton (movie / tv)
export function MediaDetailSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-svh">
      {/* Backdrop area mimicking MediaHero */}
      <div className="relative h-[65svh] w-full overflow-hidden">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-transparent" />
      </div>

      {/* Content Container shifted upwards to overlap backdrop */}
      <div className="relative z-20 mx-auto -mt-24 flex max-w-7xl flex-col items-start gap-8 px-6 sm:-mt-36 sm:px-12 md:-mt-44 md:flex-row md:gap-12 md:px-20">
        {/* Large Poster Sidebar */}
        <div className="hidden w-64 shrink-0 overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-900 md:block">
          <Skeleton className="aspect-2/3 w-full rounded-none" />
        </div>

        {/* Details Header Details */}
        <div className="flex w-full flex-1 flex-col items-start gap-4 text-left">
          {/* Genre Badges */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-xl" />
            <Skeleton className="h-6 w-20 rounded-xl" />
            <Skeleton className="h-6 w-16 rounded-xl" />
          </div>

          {/* Title or Logo Placeholder */}
          <Skeleton className="h-12 w-3/4 rounded-lg sm:h-16 md:h-20" />

          {/* Tagline */}
          <Skeleton className="h-5 w-1/2 rounded" />

          {/* Meta rows (Rating, Year, Duration) */}
          <div className="flex w-full flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Action buttons / quick stats */}
          <div className="mt-2 flex w-full flex-wrap gap-4">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>

      {/* Below-fold content */}
      <div className="mx-auto mt-10 max-w-7xl space-y-10 px-6 py-10 sm:px-12 md:px-20">
        {/* Cast row */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-32 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex shrink-0 flex-col items-center gap-2"
              >
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Person Detail Page Skeleton
export function PersonDetailSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-svh pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
        {/* Back Link Placeholder */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded" />
        </div>

        {/* Profile Header Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr] lg:gap-16">
          {/* Left Column: Photo & Details */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="aspect-2/3 w-full max-w-70 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-2xl">
              <Skeleton className="h-full w-full rounded-none" />
            </div>

            <div className="mt-8 w-full space-y-4">
              <Skeleton className="h-6 w-32 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-4.5 w-24 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-4.5 w-32 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-4.5 w-40 rounded" />
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Filmography */}
          <div className="flex w-full flex-col gap-8">
            <div>
              {/* Name */}
              <Skeleton className="h-10 w-2/3 rounded-lg sm:h-12" />

              {/* Biography */}
              <div className="mt-6 space-y-3">
                <Skeleton className="h-6 w-24 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-11/12 rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
              </div>
            </div>

            {/* Filmography Section */}
            <div>
              {/* Title & Filter bar header */}
              <div className="border-zinc-850 mb-6 flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
                <Skeleton className="h-8 w-44 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-32 rounded-xl" />
                  <Skeleton className="h-9 w-32 rounded-xl" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>

              {/* Grid of movies/tv shows */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <CardSkeleton />
                    <Skeleton className="mx-auto h-3 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Company Detail Page Skeleton
export function CompanyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black pt-20 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded" />
        </div>

        {/* Company Profile Header */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl sm:p-8 md:p-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            {/* Studio Logo */}
            <Skeleton className="aspect-[4/3] w-[220px] rounded-2xl" />

            {/* Company Info */}
            <div className="w-full flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Skeleton className="h-10 w-48 rounded-lg sm:h-12" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>

              {/* Meta information tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>

              {/* Description */}
              <div className="mt-5 space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-11/12 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="mb-8 flex flex-col gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>

        {/* Media Catalog Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Search Page Skeleton
export function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 pt-24 pb-12 sm:px-16">
      {/* Search bar */}
      <Skeleton className="mb-8 h-12 w-full max-w-2xl rounded-full" />

      {/* Type filters */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
