"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { TMDBMedia } from "@/lib/tmdb";
import { getMediaRecommendations } from "@/lib/tmdb-actions";
import Carousel from "./carousel";
import { CarouselSkeleton } from "./skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export interface RecommendationSeed {
  mediaId: string;
  mediaType: "movie" | "tv";
  title: string;
  source: "watched" | "watchlist";
}

interface BecauseYouWatchedSectionProps {
  seed: RecommendationSeed | null;
  onQuickView: (media: TMDBMedia) => void;
  onAuthRequired: () => void;
}

export default function BecauseYouWatchedSection({
  seed,
  onQuickView,
  onAuthRequired,
}: BecauseYouWatchedSectionProps) {
  const seedMediaId = seed?.mediaId;
  const seedMediaType = seed?.mediaType;
  const currentSeedKey =
    seedMediaId && seedMediaType ? `${seedMediaType}-${seedMediaId}` : null;

  const [result, setResult] = useState<{
    key: string;
    items: TMDBMedia[];
  } | null>(null);

  useEffect(() => {
    if (!seedMediaId || !seedMediaType || !currentSeedKey) {
      return;
    }

    let active = true;
    getMediaRecommendations(seedMediaType, seedMediaId)
      .then((data) => {
        if (active) setResult({ key: currentSeedKey, items: data });
      })
      .catch(() => {
        if (active) setResult({ key: currentSeedKey, items: [] });
      });

    return () => {
      active = false;
    };
  }, [seedMediaId, seedMediaType, currentSeedKey]);

  const isLoading = currentSeedKey !== null && result?.key !== currentSeedKey;
  const items =
    currentSeedKey !== null && result?.key === currentSeedKey
      ? result.items
      : [];

  if (!seed) return null;
  if (!isLoading && items.length === 0) return null;

  return (
    <section
      aria-labelledby="because-you-watched-heading"
      className="animate-in fade-in flex w-full flex-col gap-6 py-6 duration-300"
    >
      <div className="flex items-center gap-2.5 px-6 sm:px-16 md:px-20">
        {isLoading ? (
          <Skeleton className="h-6 w-64 rounded-md" />
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Compass className="text-primary h-5 w-5 shrink-0" aria-hidden="true" />
            <h2
              id="because-you-watched-heading"
              className="text-xl font-bold tracking-tight text-white sm:text-2xl"
            >
              {seed.source === "watched"
                ? "Because you watched"
                : "Based on your watchlist:"}{" "}
              <Link
                href={`/${seed.mediaType}/${seed.mediaId}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {seed.title}
              </Link>
            </h2>
          </div>
        )}
      </div>

      {isLoading ? (
        <CarouselSkeleton fullBleed />
      ) : (
        <Carousel
          items={items}
          onQuickView={onQuickView}
          onAuthRequired={onAuthRequired}
          fullBleed
        />
      )}
    </section>
  );
}
