"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import regionsData from "@/data/iso-3166.json";
import { getTMDBProviders, TMDBProvider } from "@/lib/tmdb-actions";
import { Skeleton } from "@/components/ui/skeleton";

interface RegionItem {
  name: string;
  "alpha-2": string;
}

const FEATURED_PROVIDER_IDS = [
  8, // Netflix
  1899, // Max
  9, // Amazon Prime Video
  337, // Disney+
  350, // Apple TV+
  15, // Hulu
  531, // Paramount+
  386, // Peacock
  283, // Crunchyroll
  43, // Starz
  37, // Showtime
  11, // MUBI
  99, // Shudder
  73, // Tubi TV
  300, // Pluto TV
];

const MAX_PROVIDERS = 20;

export default function StreamingProvidersBar() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );

  const isAuthResolving =
    session.isPending || (isLoggedIn && currentUser === undefined);

  const userCountryCode = useMemo(() => {
    const userCountry = currentUser?.country?.trim();
    if (userCountry) {
      if (userCountry.length === 2) {
        return userCountry.toUpperCase();
      }
      const found = (regionsData as RegionItem[]).find(
        (r) => r.name.toLowerCase() === userCountry.toLowerCase(),
      );
      if (found?.["alpha-2"]) {
        return found["alpha-2"].toUpperCase();
      }
    }

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const locale =
        navigator.language || (navigator.languages && navigator.languages[0]);
      if (locale) {
        const parts = locale.split("-");
        if (parts.length >= 2 && parts[1].length === 2) {
          return parts[1].toUpperCase();
        }
      }
    }

    return "US";
  }, [currentUser?.country]);

  const [providers, setProviders] = useState<TMDBProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthResolving) return;

    let active = true;
    getTMDBProviders(userCountryCode)
      .then(async (data) => {
        if (!active) return;
        if (data.length === 0 && userCountryCode !== "US") {
          const fallback = await getTMDBProviders("US");
          if (active) setProviders(fallback);
          return;
        }
        setProviders(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAuthResolving, userCountryCode]);

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

    const others = withLogo
      .filter((p) => !priorityMap.has(p.provider_id))
      .sort((a, b) => {
        const priorityDiff =
          (a.display_priority ?? Number.MAX_SAFE_INTEGER) -
          (b.display_priority ?? Number.MAX_SAFE_INTEGER);
        if (priorityDiff !== 0) return priorityDiff;
        return a.provider_name.localeCompare(b.provider_name);
      });
    return [...featured, ...others].slice(0, MAX_PROVIDERS);
  }, [providers]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center gap-3.5 overflow-hidden px-6 pt-6 sm:px-16 md:px-20">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="h-14 w-40 shrink-0 rounded-2xl sm:h-16 sm:w-44"
          />
        ))}
      </div>
    );
  }

  if (orderedProviders.length === 0) {
    return null;
  }

  return (
    <section aria-label={`Streaming Services (${userCountryCode})`} className="w-full pt-6">
      <Swiper
        modules={[Mousewheel, FreeMode]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={14}
        mousewheel={{ forceToAxis: true }}
        className="w-full px-6! py-1 sm:px-16! md:px-20!"
      >
        {orderedProviders.map((provider) => (
          <SwiperSlide key={provider.provider_id} className="w-auto!">
            <Link
              href={`/search?providerId=${provider.provider_id}`}
              className="group flex h-14 shrink-0 items-center gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 px-4 py-2.5 pl-2 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/90 active:scale-95 sm:h-16 sm:px-5 sm:pl-3"
            >
              <img
                src={`https://image.tmdb.org/t/p/w154${provider.logo_path}`}
                alt={provider.provider_name}
                loading="lazy"
                className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-sm sm:h-10 sm:w-10"
                draggable={false}
              />
              <span className="text-sm font-semibold whitespace-nowrap text-zinc-200 transition-colors group-hover:text-white sm:text-base">
                {provider.provider_name}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
