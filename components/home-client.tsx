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
