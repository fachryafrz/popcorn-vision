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
    <div className="relative flex h-[90svh] w-full items-end overflow-hidden bg-zinc-950 px-6 pb-12 sm:h-svh sm:px-16">
      {/* Backdrop mockup */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

      {/* Hero content */}
      <div className="relative z-20 flex w-full max-w-4xl flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
        {/* Poster Skeleton */}
        <Skeleton className="hidden h-72 w-48 shrink-0 rounded-xl shadow-2xl shadow-black/80 sm:block" />

        {/* Text Skeletons */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Badge & Rating Skeletons */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          {/* Title */}
          <Skeleton className="h-12 w-3/4 rounded-lg sm:h-16" />
          {/* Overview */}
          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
          {/* Action buttons */}
          <div className="mt-6 flex gap-4">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
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
      {/* Poster area */}
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl border border-zinc-800/40 bg-zinc-900">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      {/* Info / Metadata */}
      <div className="flex flex-col gap-1.5 px-1">
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-3.5 w-1/3 rounded-sm bg-primary/25" />
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
            <ContinueWatchingCardSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

