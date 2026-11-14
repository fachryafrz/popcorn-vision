"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import {
  getTrendingPeople,
  TMDBTrendingPerson,
} from "@/lib/tmdb-actions";
import { Skeleton } from "@/components/ui/skeleton";

interface PopularPeopleSectionProps {
  onPersonClick: (personId: number) => void;
}

export default function PopularPeopleSection({
  onPersonClick,
}: PopularPeopleSectionProps) {
  const [people, setPeople] = useState<TMDBTrendingPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getTrendingPeople()
      .then((data) => {
        if (active) setPeople(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!isLoading && people.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="popular-people-heading"
      className="flex w-full flex-col gap-6 py-6"
    >
      <div className="flex items-center gap-2.5 px-6 sm:px-16 md:px-20">
        <Users className="text-primary h-5 w-5" aria-hidden="true" />
        <h2
          id="popular-people-heading"
          className="text-xl font-bold tracking-tight text-white sm:text-2xl"
        >
          Trending People
        </h2>
      </div>

      {isLoading ? (
        <div className="swiper-carousel-container relative w-full">
          <Swiper
            key="popular-people-skeleton"
            spaceBetween={16}
            slidesPerView={3}
            breakpoints={{
              480: { slidesPerView: 4, spaceBetween: 16 },
              640: { slidesPerView: 5, spaceBetween: 20 },
              768: { slidesPerView: 6, spaceBetween: 20 },
              1024: { slidesPerView: 8, spaceBetween: 24 },
              1280: { slidesPerView: 10, spaceBetween: 24 },
            }}
            className="w-full px-6! pb-4 sm:px-16! md:px-20!"
            allowTouchMove={false}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <SwiperSlide key={i} className="py-1">
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="aspect-square w-full max-w-28 rounded-full" />
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <Skeleton className="h-3 w-14 rounded" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="swiper-carousel-container relative w-full">
          <Swiper
            key="popular-people-swiper"
            modules={[Mousewheel, FreeMode]}
            freeMode={true}
            preventClicks
            preventClicksPropagation
            spaceBetween={16}
            slidesPerView={3}
            breakpoints={{
              480: { slidesPerView: 4, spaceBetween: 16 },
              640: { slidesPerView: 5, spaceBetween: 20 },
              768: { slidesPerView: 6, spaceBetween: 20 },
              1024: { slidesPerView: 8, spaceBetween: 24 },
              1280: { slidesPerView: 10, spaceBetween: 24 },
            }}
            mousewheel={{ forceToAxis: true }}
            className="w-full px-6! pb-4 sm:px-16! md:px-20!"
          >
            {people.map((person) => {
              const pic = person.profile_path
                ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                : "/logo/v2/popcorn_cropped_transparent.png";
              const subtitle =
                person.known_for?.[0]?.title ||
                person.known_for?.[0]?.name ||
                person.known_for_department ||
                "";

              return (
                <SwiperSlide key={person.id} className="py-1">
                  <button
                    type="button"
                    onClick={() => onPersonClick(person.id)}
                    className="group flex w-full cursor-pointer flex-col items-center rounded-xl px-1 py-2 text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    aria-label={person.name}
                  >
                    <span
                      className="group-hover:border-primary mb-2.5 block aspect-square w-full max-w-28 rounded-full border-2 border-zinc-800 bg-zinc-900 bg-cover bg-center shadow-md transition-[transform,border-color] duration-200 group-hover:scale-105"
                      style={{ backgroundImage: `url(${pic})` }}
                      aria-hidden="true"
                    />
                    <span className="group-hover:text-primary w-full truncate text-sm font-semibold text-white transition-colors">
                      {person.name}
                    </span>
                    {subtitle && (
                      <span className="mt-0.5 w-full truncate text-xs text-zinc-500">
                        {subtitle}
                      </span>
                    )}
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </section>
  );
}
