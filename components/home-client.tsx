"use client";

import { useState } from "react";
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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import ContinueWatchingCard from "./continue-watching-card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Play } from "lucide-react";

interface HomeClientProps {
  initialHero: TMDBMedia[];
  initialTrending: TMDBMedia[];
  initialStreaming: TMDBMedia[];
  initialGenre: TMDBMedia[];
}

export default function HomeClient({
  initialHero,
  initialTrending,
  initialStreaming,
  initialGenre,
}: HomeClientProps) {
  const openAuth = useAuthModalStore((state) => state.open);
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const continueWatching = useQuery(
    api.continueWatching.getProgress,
    isLoggedIn ? {} : "skip"
  );

  const handleQuickView = (media: TMDBMedia) => {
    setQuickViewMedia(media);
  };

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col overflow-x-hidden font-sans transition-colors duration-300 select-none">
      <main className="flex grow flex-col">
        {/* Fullscreen Hero Carousel */}
        <Hero
          items={initialHero}
          onQuickView={handleQuickView}
          onAuthRequired={openAuth}
        />

        {/* Categories Section Carousels */}
        <div className="bg-background relative z-20 flex flex-col gap-6 pb-20 transition-colors duration-300">
          {/* Continue Watching Section */}
          {isLoggedIn && continueWatching && continueWatching.length > 0 && (
            <div className="flex w-full flex-col gap-6 px-6 py-6 sm:px-16 md:px-20">
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                <Play className="h-5 w-5 fill-current text-blue-500" />
                Continue Watching
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
          )}

          {/* Trending Now */}
          <div id="trending">
            <Section
              titleType="text"
              defaultFetch={async () => initialTrending}
              onTrendingChange={async (type) => getTrending(type)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </div>

          {/* Streaming Services Originals */}
          <div id="originals">
            <Section
              titleType="dropdown-streaming"
              defaultFetch={async () => initialStreaming}
              onStreamingChange={async (key) => getStreamingOriginals(key)}
              onQuickView={handleQuickView}
              onAuthRequired={openAuth}
            />
          </div>

          {/* Browse by Category */}
          <div id="category">
            <Section
              titleType="dropdown-genre"
              defaultFetch={async () => initialGenre}
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
