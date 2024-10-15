"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import FilmCard from "./Card";
import Reveal from "../Layout/Reveal";

export default function FilmGrid({
  films,
  fetchMoreFilms,
  currentSearchPage,
  totalSearchPages,
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
      <div className="grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7">
        {films.map((film) => {
          return (
            <Reveal key={film.id} y={0}>
              <FilmCard
                film={film}
                isTvPage={isQueryParams ? film.media_type === "tv" : isTvPage}
              />
            </Reveal>
          );
        })}
      </div>

      {totalSearchPages > currentSearchPage && (
        <div
          ref={loadMoreRef}
          className={`mt-4 flex items-center justify-center`}
        >
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}
    </div>
  );
}
