"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import {
  getPopularCollections,
  TMDBCollectionDetails,
} from "@/lib/tmdb-actions";
import { CollectionsCarouselSkeleton } from "@/components/skeletons";

const IMAGE_BASE =
  process.env.NEXT_PUBLIC_API_IMAGE_500 || "https://image.tmdb.org/t/p/w500";

export default function CollectionsSection() {
  const [collections, setCollections] = useState<TMDBCollectionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPopularCollections()
      .then((data) => {
        if (active) setCollections(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!isLoading && collections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="popular-collections-heading"
      className="flex w-full flex-col gap-6 py-6"
    >
      <div className="flex items-center justify-between gap-4 px-6 sm:px-16 md:px-20">
        <h2
          id="popular-collections-heading"
          className="text-xl font-bold tracking-tight text-white sm:text-2xl"
        >
          Popular Collections
        </h2>
      </div>

      {isLoading ? (
        <CollectionsCarouselSkeleton />
      ) : (
        <div className="swiper-carousel-container relative w-full">
          <Swiper
            modules={[Mousewheel, FreeMode]}
            freeMode={true}
            spaceBetween={16}
            slidesPerView={1.25}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              768: { slidesPerView: 2.7, spaceBetween: 24 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            mousewheel={{ forceToAxis: true }}
            className="w-full px-6! pb-4 sm:px-16! md:px-20!"
          >
            {collections.map((collection) => {
              const imagePath =
                collection.backdrop_path || collection.poster_path;
              const imageUrl = imagePath
                ? `${IMAGE_BASE}${imagePath}`
                : "/logo/v2/popcorn_cropped_transparent.png";
              const partCount = collection.parts?.length ?? 0;

              return (
                <SwiperSlide key={collection.id} className="py-1">
                  <Link
                    href={`/collection/${collection.id}`}
                    className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-lg transition-all duration-300 hover:border-zinc-600/80 hover:shadow-2xl"
                  >
                    <img
                      src={imageUrl}
                      alt={collection.name}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

                    {/* Movies count pill */}
                    {partCount > 0 && (
                      <div className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-200 backdrop-blur-md">
                        {partCount} {partCount === 1 ? "Movie" : "Movies"}
                      </div>
                    )}

                    {/* Title & subtle CTA */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left">
                      <h3 className="group-hover:text-primary line-clamp-1 text-base font-bold tracking-tight text-white transition-colors sm:text-lg">
                        {collection.name.replace(/\s+Collection$/i, "")}
                      </h3>
                      {collection.overview && (
                        <p className="line-clamp-1 text-xs text-zinc-300/85">
                          {collection.overview}
                        </p>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </section>
  );
}
