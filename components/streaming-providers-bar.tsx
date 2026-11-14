"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import { getTMDBProviders, TMDBProvider } from "@/lib/tmdb-actions";
import { Skeleton } from "@/components/ui/skeleton";

const FEATURED_PROVIDER_IDS = [
  8,    // Netflix
  1899, // Max
  9,    // Amazon Prime Video
  337,  // Disney+
  350,  // Apple TV+
  15,   // Hulu
  531,  // Paramount+
  386,  // Peacock
  283,  // Crunchyroll
  43,   // Starz
  37,   // Showtime
  11,   // MUBI
  99,   // Shudder
  73,   // Tubi TV
  300,  // Pluto TV
];

const MAX_PROVIDERS = 20;

export default function StreamingProvidersBar() {
  const [providers, setProviders] = useState<TMDBProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getTMDBProviders("US")
      .then((data) => {
        if (!active) return;
        setProviders(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const orderedProviders = useMemo(() => {
    const withLogo = providers.filter((p) => Boolean(p.logo_path));
    const priorityMap = new Map(
      FEATURED_PROVIDER_IDS.map((id, index) => [id, index]),
    );

    const featured = withLogo
      .filter((p) => priorityMap.has(p.provider_id))
      .sort(
        (a, b) =>
          (priorityMap.get(a.provider_id) ?? 0) -
          (priorityMap.get(b.provider_id) ?? 0),
      );

    const others = withLogo.filter((p) => !priorityMap.has(p.provider_id));
    return [...featured, ...others].slice(0, MAX_PROVIDERS);
  }, [providers]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center gap-3 overflow-hidden px-6 pt-6 sm:px-16 md:px-20">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="h-11 w-32 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  if (orderedProviders.length === 0) {
    return null;
  }

  return (
    <section aria-label="Streaming Services" className="w-full pt-6">
      <Swiper
        modules={[Mousewheel, FreeMode]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={12}
        mousewheel={{ forceToAxis: true }}
        className="w-full px-6! py-1 sm:px-16! md:px-20!"
      >
        {orderedProviders.map((provider) => (
          <SwiperSlide key={provider.provider_id} className="w-auto!">
            <Link
              href={`/search?providerId=${provider.provider_id}`}
              className="group flex h-11 shrink-0 items-center gap-2.5 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-4 py-1.5 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/90 active:scale-95"
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                alt={provider.provider_name}
                loading="lazy"
                className="h-6 w-6 shrink-0 rounded-full object-cover shadow-sm"
                draggable={false}
              />
              <span className="text-xs font-semibold whitespace-nowrap text-zinc-200 transition-colors group-hover:text-white sm:text-sm">
                {provider.provider_name}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
