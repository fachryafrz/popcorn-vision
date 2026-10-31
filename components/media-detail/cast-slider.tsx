"use client";

import { Tv, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import { CastItem } from "./types";

interface CastSliderProps {
  cast: CastItem[];
  onPersonClick?: (id: number) => void;
}

export default function CastSlider({ cast, onPersonClick }: CastSliderProps) {
  if (cast.length === 0) return null;

  return (
    <section aria-labelledby="cast-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="cast-heading"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
        >
          <Tv className="text-primary h-5 w-5" aria-hidden="true" />
          Key Cast & Characters
        </h2>

        <div className="flex items-center gap-2">
          <button
            id="cast-slider-prev"
            type="button"
            className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-30 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30 cursor-pointer"
            aria-label="Previous cast"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            id="cast-slider-next"
            type="button"
            className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-30 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30 cursor-pointer"
            aria-label="Next cast"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>
        </div>
      </div>

      <div className="swiper-cast-container relative w-full">
        <Swiper
          modules={[FreeMode, Mousewheel, Navigation]}
          freeMode
          navigation={{
            prevEl: "#cast-slider-prev",
            nextEl: "#cast-slider-next",
          }}
          onSwiper={(swiper) => {
            if (swiper.navigation && typeof swiper.navigation.init === "function") {
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          spaceBetween={12}
          slidesPerView={2.5}
          mousewheel={{ forceToAxis: true }}
          preventClicks
          preventClicksPropagation
          breakpoints={{
            480: { slidesPerView: 3.5, spaceBetween: 14 },
            640: { slidesPerView: 4, spaceBetween: 16 },
            768: { slidesPerView: 5, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
          }}
          className="cast-swiper w-full"
        >
          {cast.map((actor) => {
            const actorPic = actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : "/logo/v2/popcorn_transparent.png";

            return (
              <SwiperSlide key={actor.id} className="py-1">
                <button
                  type="button"
                  onClick={() => onPersonClick?.(actor.id)}
                  className="group focus-visible:ring-primary flex w-full cursor-pointer flex-col items-center rounded-xl px-1 py-2 text-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
                  aria-label={`${actor.name} as ${actor.character}`}
                >
                  <span
                    className="group-hover:border-primary mb-3 block aspect-square w-full max-w-24 rounded-full border-2 border-zinc-800 bg-zinc-900 bg-cover bg-center shadow-md transition-[transform,border-color] duration-200 group-hover:scale-105"
                    style={{ backgroundImage: `url(${actorPic})` }}
                    aria-hidden="true"
                  />
                  <span className="group-hover:text-primary w-full truncate text-sm font-semibold text-white transition-colors">
                    {actor.name}
                  </span>
                  <span className="mt-1 w-full truncate text-xs text-zinc-500">
                    {actor.character}
                  </span>
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
