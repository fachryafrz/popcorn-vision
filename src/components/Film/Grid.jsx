"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import FilmCard from "./Card";

export default function FilmGrid({
  films,
  fetchMoreFilms,
  currentSearchPage,
  totalSearchPages,
  loading,
  initialLoading = false,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTvPage = pathname.startsWith("/tv");
  const isQueryParams = searchParams.get("query");

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreFilms();
        }
      },
      { threshold: 0.5 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchMoreFilms]);

  return (
    <div
      className={`relative z-10 mx-auto flex w-full max-w-none flex-col gap-2 @container`}
    >
      <ul className="grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7">
        {/* Initial loading */}
        {initialLoading &&
          loading &&
          [...Array(20)].map((_, i) => (
            <span
              key={i}
              className={`aspect-poster animate-pulse rounded-xl bg-gray-400 bg-opacity-20`}
            ></span>
          ))}

        {/* Results */}
        {films?.map((film) => {
          return (
            <li key={film.id}>
              <FilmCard
                film={film}
                isTvPage={isQueryParams ? film.media_type === "tv" : isTvPage}
              />
            </li>
          );
        })}

        {/* Infinite loading */}
        {(!loading && totalSearchPages > currentSearchPage) &&
          [...Array(20)].map((_, i) => (
            <span
              key={i + 20}
              ref={i === 0 ? loadMoreRef : null}
              className={`aspect-poster animate-pulse rounded-xl bg-gray-400 bg-opacity-20`}
            ></span>
          ))}
      </ul>
    </div>
  );
}
