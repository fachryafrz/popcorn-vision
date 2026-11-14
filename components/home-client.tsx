"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { TMDBMedia } from "@/lib/tmdb";
import {
  getHeroItems,
  getTrending,
  getStreamingOriginals,
  getByCategory,
  getUpcomingMedia,
  getUpcomingMovies,
  getUpcomingTVShows,
} from "@/lib/tmdb-actions";
import Hero from "./hero";
import Section from "./section";
import StreamingProvidersBar from "./streaming-providers-bar";
import CollectionsSection from "./collections-section";
import BecauseYouWatchedSection, {
  RecommendationSeed,
} from "./because-you-watched-section";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import QuickViewModal from "./quick-view-modal";
import PersonQuickViewModal from "./person-quick-view-modal";
import {
  useQuickViewMediaState,
  useQuickViewPersonState,
} from "@/hooks/use-query-modal-state";
import PopularPeopleSection from "./popular-people-section";
import KoreanSection from "./korean-section";
import LazySection from "./lazy-section";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useGuestContinueWatching } from "@/hooks/use-guest-continue-watching";
import { useGuestWatchlist } from "@/hooks/use-guest-watchlist";
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

export interface HomeInitialData {
  hero: TMDBMedia[];
  trending: TMDBMedia[];
  streaming: TMDBMedia[];
  category: TMDBMedia[];
  upcoming?: TMDBMedia[];
}

let cachedHomeData: HomeInitialData | null = null;

export default function HomeClient({
  initialData,
}: {
  initialData?: HomeInitialData;
} = {}) {
  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMediaRef, setQuickViewMediaRef] = useQuickViewMediaState();
  const [quickViewPersonId, setQuickViewPersonId] = useQuickViewPersonState();

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

  const [heroItems, setHeroItems] = useState<TMDBMedia[]>(
    () => initialData?.hero ?? cachedHomeData?.hero ?? [],
  );
  const [trendingItems, setTrendingItems] = useState<TMDBMedia[]>(
    () => initialData?.trending ?? cachedHomeData?.trending ?? [],
  );
  const [streamingItems, setStreamingItems] = useState<TMDBMedia[]>(
    () => initialData?.streaming ?? cachedHomeData?.streaming ?? [],
  );
  const [categoryItems, setCategoryItems] = useState<TMDBMedia[]>(
    () => initialData?.category ?? cachedHomeData?.category ?? [],
  );
  const [upcomingItems, setUpcomingItems] = useState<TMDBMedia[]>(
    () => initialData?.upcoming ?? cachedHomeData?.upcoming ?? [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    () => !(initialData || cachedHomeData),
  );

  useEffect(() => {
    if (initialData) {
      cachedHomeData = initialData;
      return;
    }

    if (cachedHomeData) {
      return;
    }

    let isMounted = true;
    Promise.all([
      getHeroItems(),
      getTrending("all"),
      getStreamingOriginals("netflix"),
      getByCategory("Action"),
      getUpcomingMedia(),
    ])
      .then(([hero, trending, streaming, category, upcoming]) => {
        if (!isMounted) return;
        const homeData: HomeInitialData = {
          hero,
          trending,
          streaming,
          category,
          upcoming,
        };
        cachedHomeData = homeData;
        setHeroItems(homeData.hero);
        setTrendingItems(homeData.trending);
        setStreamingItems(homeData.streaming);
        setCategoryItems(homeData.category);
        setUpcomingItems(homeData.upcoming ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error loading home data:", err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialData]);

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

  const {
    items: guestContinueWatching,
    isLoaded: isGuestLoaded,
    clearAll: clearGuestItems,
  } = useGuestContinueWatching();

  const {
    items: guestWatchlist,
    isLoaded: isGuestWatchlistLoaded,
    clearAll: clearGuestWatchlistItems,
  } = useGuestWatchlist();

  const upsertWatchProgress = useMutation(api.continueWatching.upsertProgress);
  const addToWatchlistMutation = useMutation(api.watchlist.addToWatchlist);
  const isSyncingGuestRef = useRef(false);
  const isSyncingGuestWatchlistRef = useRef(false);

  // Auto-sync guest continue watching progress to Convex when user logs in
  useEffect(() => {
    if (
      isLoggedIn &&
      isGuestLoaded &&
      guestContinueWatching.length > 0 &&
      !isSyncingGuestRef.current
    ) {
      isSyncingGuestRef.current = true;
      Promise.allSettled(
        guestContinueWatching.map((item) =>
          upsertWatchProgress({
            mediaId: item.mediaId,
            mediaType: item.mediaType,
            title: item.title,
            posterPath: item.posterPath,
            backdropPath: item.backdropPath,
            episodeStillPath: item.episodeStillPath,
            season: item.season,
            episode: item.episode,
          }),
        ),
      ).then(() => {
        clearGuestItems();
        isSyncingGuestRef.current = false;
      });
    }
  }, [
    isLoggedIn,
    isGuestLoaded,
    guestContinueWatching,
    upsertWatchProgress,
    clearGuestItems,
  ]);

  // Auto-sync guest watchlist items to Convex when user logs in
  useEffect(() => {
    if (
      isLoggedIn &&
      isGuestWatchlistLoaded &&
      guestWatchlist.length > 0 &&
      !isSyncingGuestWatchlistRef.current
    ) {
      isSyncingGuestWatchlistRef.current = true;
      Promise.allSettled(
        guestWatchlist.map((item) =>
          addToWatchlistMutation({
            mediaId: item.mediaId,
            mediaType: item.mediaType,
            title: item.title,
            posterPath: item.posterPath,
            rating: item.rating,
            releaseYear: item.releaseYear || "N/A",
          }),
        ),
      ).then(() => {
        clearGuestWatchlistItems();
        isSyncingGuestWatchlistRef.current = false;
      });
    }
  }, [
    isLoggedIn,
    isGuestWatchlistLoaded,
    guestWatchlist,
    addToWatchlistMutation,
    clearGuestWatchlistItems,
  ]);

  const recommendationSeed = useMemo<RecommendationSeed | null>(() => {
    if (isLoggedIn) {
      const cw = continueWatching?.[0];
      if (cw) {
        return {
          mediaId: cw.mediaId,
          mediaType: cw.mediaType === "tv" ? "tv" : "movie",
          title: cw.title,
          source: "watched",
        };
      }
      const wl = watchlist?.[0];
      if (wl) {
        return {
          mediaId: wl.mediaId,
          mediaType: wl.mediaType === "tv" ? "tv" : "movie",
          title: wl.title,
          source: "watchlist",
        };
      }
      return null;
    }

    if (isGuestLoaded && guestContinueWatching.length > 0) {
      const cw = guestContinueWatching[0];
      return {
        mediaId: cw.mediaId,
        mediaType: cw.mediaType === "tv" ? "tv" : "movie",
        title: cw.title,
        source: "watched",
      };
    }

    if (isGuestWatchlistLoaded && guestWatchlist.length > 0) {
      const wl = guestWatchlist[0];
      return {
        mediaId: wl.mediaId,
        mediaType: wl.mediaType === "tv" ? "tv" : "movie",
        title: wl.title,
        source: "watchlist",
      };
    }

    return null;
  }, [
    isLoggedIn,
    continueWatching,
    watchlist,
    isGuestLoaded,
    guestContinueWatching,
    isGuestWatchlistLoaded,
    guestWatchlist,
  ]);

  const handleQuickView = (media: TMDBMedia) => {
    setQuickViewMedia(media);
  };

  if (isLoading) {
    return (
      <div className="bg-background text-foreground flex min-h-svh flex-col overflow-x-hidden font-sans">
        <HeroSkeleton />
        <div className="bg-background relative z-20 flex flex-col gap-6 pb-4 lg:pb-20">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex w-full flex-col gap-6 py-6"
            >
              <Skeleton className="mx-6 h-6 w-44 rounded-md sm:mx-16 md:mx-20" />
              <CarouselSkeleton fullBleed />
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
        <div className="bg-background relative z-20 flex flex-col gap-6 pb-4 transition-colors duration-300 lg:pb-20">
          {/* Streaming Services Pills Slider */}
          <StreamingProvidersBar />

          {/* Continue Watching Section (Logged-In or Guest) */}
          {isLoggedIn ? (
            continueWatching === undefined ? (
              <div className="flex w-full flex-col gap-6 py-6">
                <div className="flex items-center gap-2 px-6 sm:px-16 md:px-20">
                  <Skeleton className="h-6 w-44 rounded-md" />
                </div>
                <ContinueWatchingCarouselSkeleton fullBleed />
              </div>
            ) : continueWatching.length > 0 ? (
              <div className="animate-in fade-in flex w-full flex-col gap-6 py-6 duration-300">
                <h2 className="flex items-center gap-2 px-6 text-xl font-bold tracking-tight text-white sm:px-16 sm:text-2xl md:px-20">
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
                    className="w-full px-6! pb-4 sm:px-16! md:px-20!"
                  >
                    {continueWatching.map((item) => (
                      <SwiperSlide key={item._id} className="py-1">
                        <ContinueWatchingCard item={item} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            ) : null
          ) : isGuestLoaded && guestContinueWatching.length > 0 ? (
            <div className="animate-in fade-in flex w-full flex-col gap-6 py-6 duration-300">
              <h2 className="flex items-center gap-2 px-6 text-xl font-bold tracking-tight text-white sm:px-16 sm:text-2xl md:px-20">
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
                  className="w-full px-6! pb-4 sm:px-16! md:px-20!"
                >
                  {guestContinueWatching.map((item) => (
                    <SwiperSlide key={item._id} className="py-1">
                      <ContinueWatchingCard item={item} isGuest={true} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : null}

          {/* Watchlist Section (Logged-In or Guest) */}
          {isLoggedIn ? (
            watchlist === undefined ? (
              <div className="flex w-full flex-col gap-6 py-6">
                <div className="flex items-center gap-2 px-6 sm:px-16 md:px-20">
                  <Skeleton className="h-6 w-36 rounded-md" />
                </div>
                <CarouselSkeleton fullBleed />
              </div>
            ) : watchlist.length > 0 ? (
              <div className="animate-in fade-in flex w-full flex-col gap-6 py-6 duration-300">
                <Link
                  href={username ? `/@${username}?tab=watchlist` : "#"}
                  className="group flex w-fit items-center gap-1.5 px-6 text-xl font-bold tracking-tight text-white sm:px-16 sm:text-2xl md:px-20"
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
                    className="w-full px-6! pb-4 sm:px-16! md:px-20!"
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
            ) : null
          ) : isGuestWatchlistLoaded && guestWatchlist.length > 0 ? (
            <div className="animate-in fade-in flex w-full flex-col gap-6 py-6 duration-300">
              <h2 className="flex items-center gap-2 px-6 text-xl font-bold tracking-tight text-white sm:px-16 sm:text-2xl md:px-20">
                My Watchlist
              </h2>
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
                  className="w-full px-6! pb-4 sm:px-16! md:px-20!"
                >
                  {guestWatchlist.map((item) => {
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
          ) : null}

          {/* Trending Now */}
          <div id="trending">
            <Section
              titleType="text"
              initialItems={trendingItems}
              defaultFetch={async () => trendingItems}
              onTrendingChange={async (type) => getTrending(type)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </div>

          {/* Personal Recommendations ("Because you watched ...") */}
          <BecauseYouWatchedSection
            seed={recommendationSeed}
            onQuickView={handleQuickView}
            onAuthRequired={openAuth}
          />

          {/* Popular Collections */}
          <LazySection id="collections">
            <CollectionsSection />
          </LazySection>

          {/* Upcoming Releases & Premieres Countdown */}
          <LazySection id="upcoming">
            <Section
              titleType="upcoming"
              initialItems={upcomingItems}
              defaultFetch={async () => upcomingItems}
              onUpcomingChange={async (type) => {
                if (type === "movie") return getUpcomingMovies(1);
                if (type === "tv") return getUpcomingTVShows(1);
                return getUpcomingMedia();
              }}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </LazySection>

          {/* Korean */}
          <LazySection id="korean">
            <KoreanSection
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </LazySection>

          {/* Trending People */}
          <LazySection id="people">
            <PopularPeopleSection
              onPersonClick={(personId) => setQuickViewPersonId(personId)}
            />
          </LazySection>

          {/* Streaming Services Originals */}
          <LazySection id="originals">
            <Section
              titleType="dropdown-streaming"
              initialItems={streamingItems}
              defaultFetch={async () => streamingItems}
              onStreamingChange={async (key) => getStreamingOriginals(key)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </LazySection>

          {/* Browse by Category */}
          <LazySection id="category">
            <Section
              titleType="dropdown-genre"
              initialItems={categoryItems}
              defaultFetch={async () => categoryItems}
              onGenreChange={async (name) => getByCategory(name)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </LazySection>
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

      {/* Person Quick View Modal */}
      <PersonQuickViewModal
        isOpen={!!quickViewPersonId}
        onClose={() => setQuickViewPersonId(null)}
        personId={quickViewPersonId}
      />
    </div>
  );
}
