"use client";

import { TMDBMedia } from "@/lib/tmdb";
import Card from "./card";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";

interface CarouselProps {
  items: TMDBMedia[];
  onQuickView: (media: TMDBMedia) => void;
  onAuthRequired: () => void;
}

export default function Carousel({
  items,
  onQuickView,
  onAuthRequired,
}: CarouselProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 text-sm text-zinc-500">
        No titles available in this category.
      </div>
    );
  }

  return (
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
        {items.map((item) => (
          <SwiperSlide key={`${item.media_type}-${item.id}`} className="py-1">
            <Card
              media={item}
              onQuickView={onQuickView}
              onAuthRequired={onAuthRequired}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
