"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TMDBMedia } from "@/lib/tmdb";
import {
  getTrending,
  getStreamingOriginals,
  getByCategory,
} from "@/lib/tmdb-actions";
import Hero from "./hero";
import Section from "./section";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "./quick-view-modal";
import { useQuickViewMediaState } from "@/hooks/use-query-modal-state";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import ContinueWatchingCard from "./continue-watching-card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";
import {
  CarouselSkeleton,
  ContinueWatchingCarouselSkeleton,
  HeroSkeleton,
  Skeleton,
} from "./skeletons";
import Card from "./card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HomeClient() {
  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMediaRef, setQuickViewMediaRef] = useQuickViewMediaState();

  const quickViewMedia = useMemo<TMDBMedia | null>(() => {
    if (!quickViewMediaRef) return null;
    return {
      id: Number(quickViewMediaRef.id),
      media_type: quickViewMediaRef.media_type,
    } as TMDBMedia;
  }, [quickViewMediaRef]);

  const setQuickViewMedia = useCallback(
    (media: TMDBMedia | null) => {
      if (media) {
        setQuickViewMediaRef({
          id: String(media.id),
          media_type: media.media_type || "movie",
        });
      } else {
        setQuickViewMediaRef(null);
      }
    },
    [setQuickViewMediaRef],
  );

  const [heroItems, setHeroItems] = useState<TMDBMedia[]>([]);
  const [trendingItems, setTrendingItems] = useState<TMDBMedia[]>([]);
  const [streamingItems, setStreamingItems] = useState<TMDBMedia[]>([]);
  const [categoryItems, setCategoryItems] = useState<TMDBMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tmdb/home")
      .then((res) => res.json())
      .then((data) => {
        setHeroItems(data.hero ?? []);
        setTrendingItems(data.trending ?? []);
        setStreamingItems(data.streaming ?? []);
        setCategoryItems(data.category ?? []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  const userProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );

  const username = userProfile?.username || session.data?.user?.username;

  const continueWatching = useQuery(
    api.continueWatching.getProgress,
    isLoggedIn ? {} : "skip",
  );
  const watchlist = useQuery(
    api.watchlist.getWatchlist,
    isLoggedIn ? {} : "skip",
  );

  const handleQuickView = (media: TMDBMedia) => {
    setQuickViewMedia(media);
  };

  if (isLoading) {
    return (
      <div className="bg-background text-foreground flex min-h-svh flex-col overflow-x-hidden font-sans">
        <HeroSkeleton />
        <div className="bg-background relative z-20 flex flex-col gap-6 pb-20">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex w-full flex-col gap-6 px-6 py-6 sm:px-16 md:px-20"
            >
              <Skeleton className="h-6 w-44 rounded-md" />
              <CarouselSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col overflow-x-hidden font-sans transition-colors duration-300">
      <main className="flex grow flex-col">
        {/* Fullscreen Hero Carousel */}
        <Hero
          items={heroItems}
          onQuickView={handleQuickView}
          onAuthRequired={openAuth}
        />

        {/* Categories Section Carousels */}
        <div className="bg-background relative z-20 flex flex-col gap-6 pb-20 transition-colors duration-300">
          {/* Continue Watching Section */}
          {isLoggedIn &&
            (continueWatching === undefined ? (
              <div className="flex w-full flex-col gap-6 px-6 py-6 sm:px-16 md:px-20">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-44 rounded-md" />
                </div>
                <ContinueWatchingCarouselSkeleton />
              </div>
            ) : continueWatching.length > 0 ? (
              <div className="animate-in fade-in flex w-full flex-col gap-6 px-6 py-6 duration-300 sm:px-16 md:px-20">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Continue Watching
                </h2>
                <div className="swiper-carousel-container relative w-full">
                  <Swiper
                    modules={[Mousewheel, FreeMode]}
                    freeMode={true}
                    spaceBetween={16}
                    slidesPerView={1.3}
                    breakpoints={{
                      640: { slidesPerView: 1.2, spaceBetween: 20 },
                      768: { slidesPerView: 2.7, spaceBetween: 24 },
                      1024: { slidesPerView: 3.7, spaceBetween: 24 },
                      1280: { slidesPerView: 4, spaceBetween: 24 },
                    }}
                    mousewheel={{
                      forceToAxis: true,
                    }}
                    className="w-full pb-4"
                  >
                    {continueWatching.map((item) => (
                      <SwiperSlide key={item._id} className="py-1">
                        <ContinueWatchingCard item={item} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            ) : null)}

          {/* Watchlist Section */}
          {isLoggedIn &&
            (watchlist === undefined ? (
              <div className="flex w-full flex-col gap-6 px-6 py-6 sm:px-16 md:px-20">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-36 rounded-md" />
                </div>
                <CarouselSkeleton />
              </div>
            ) : watchlist.length > 0 ? (
              <div className="animate-in fade-in flex w-full flex-col gap-6 px-6 py-6 duration-300 sm:px-16 md:px-20">
                <Link
                  href={username ? `/@${username}?tab=watchlist` : "#"}
                  className="group flex w-fit items-center gap-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl"
                >
                  <span>My Watchlist</span>
                  <ChevronRight className="h-5 w-5 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
                </Link>
                <div className="swiper-carousel-container relative w-full">
                  <Swiper
                    modules={[Mousewheel, FreeMode]}
                    freeMode={true}
                    spaceBetween={16}
                    slidesPerView={2}
                    breakpoints={{
                      640: { slidesPerView: 3, spaceBetween: 24 },
                      768: { slidesPerView: 4, spaceBetween: 24 },
                      1024: { slidesPerView: 5, spaceBetween: 24 },
                      1280: { slidesPerView: 6, spaceBetween: 24 },
                    }}
                    mousewheel={{
                      forceToAxis: true,
                    }}
                    className="w-full pb-4"
                  >
                    {watchlist.map((item) => {
                      const mediaItem: TMDBMedia = {
                        id: Number(item.mediaId),
                        media_type: item.mediaType as "movie" | "tv",
                        title: item.title,
                        name: item.title,
                        poster_path: item.posterPath,
                        vote_average: item.rating || 0,
                        release_date: item.releaseYear,
                        backdrop_path: "",
                        genre_ids: [],
                        overview: "",
                        popularity: 0,
                      };
                      return (
                        <SwiperSlide key={item._id} className="py-1">
                          <Card
                            media={mediaItem}
                            onQuickView={handleQuickView}
                            onAuthRequired={openAuth}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
            ) : null)}

          {/* Trending Now */}
          <div id="trending">
            <Section
              titleType="text"
              defaultFetch={async () => trendingItems}
              onTrendingChange={async (type) => getTrending(type)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </div>

          {/* Streaming Services Originals */}
          <div id="originals">
            <Section
              titleType="dropdown-streaming"
              defaultFetch={async () => streamingItems}
              onStreamingChange={async (key) => getStreamingOriginals(key)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </div>

          {/* Browse by Category */}
          <div id="category">
            <Section
              titleType="dropdown-genre"
              defaultFetch={async () => categoryItems}
              onGenreChange={async (name) => getByCategory(name)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}
    </div>
  );
}
