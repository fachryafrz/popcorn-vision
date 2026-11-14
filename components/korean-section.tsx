"use client";

import { useEffect, useState } from "react";
import { TMDBMedia } from "@/lib/tmdb";
import { getKoreanMedia } from "@/lib/tmdb-actions";
import Carousel from "./carousel";
import { CarouselSkeleton } from "./skeletons";
import { cn } from "@/lib/utils";

interface KoreanSectionProps {
  onQuickView: (media: TMDBMedia) => void;
  onAuthRequired: () => void;
}

export default function KoreanSection({
  onQuickView,
  onAuthRequired,
}: KoreanSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "tv">("all");
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getKoreanMedia(activeTab)
      .then((data) => {
        if (active) setItems(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeTab]);

  const handleTabChange = (tab: "all" | "movie" | "tv") => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setActiveTab(tab);
  };

  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="korean-section-heading"
      className="flex w-full flex-col gap-6 py-6"
    >
      <div className="flex flex-col justify-between gap-4 px-6 sm:flex-row sm:items-center sm:px-16 md:px-20">
        <div className="flex grow flex-wrap items-center justify-between gap-4 sm:gap-6">
          <h2
            id="korean-section-heading"
            className="text-xl font-bold tracking-tight text-white sm:text-2xl"
          >
            K-Drama &amp; Korean Cinema
          </h2>

          <div className="flex rounded-full border border-zinc-800 bg-zinc-900 p-1">
            {(["all", "movie", "tv"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all",
                  activeTab === tab
                    ? "bg-primary text-white shadow-md"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {tab === "all"
                  ? "All"
                  : tab === "movie"
                    ? "Movies"
                    : "TV Series"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <CarouselSkeleton key="korean-skeleton" fullBleed />
      ) : (
        <Carousel
          key={`korean-carousel-${activeTab}`}
          items={items}
          onQuickView={onQuickView}
          onAuthRequired={onAuthRequired}
          fullBleed
        />
      )}
    </section>
  );
}
