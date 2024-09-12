"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import FilmCard from "./Card";
import Reveal from "../Layout/Reveal";
import { useInView } from "react-intersection-observer";

export default function FilmGrid({
  films,
  fetchMoreFilms,
  currentSearchPage,
  totalSearchPages,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTvPage = pathname.startsWith("/tv");
  const isQueryParams = searchParams.get("query") ? true : false;

  // Is in viewport?
  const {
    ref: loadMoreBtn,
    inView,
    entry,
  } = useInView({
    initialInView: true,
  });

  // Use Effect for load more button is in viewport
  useEffect(() => {
    if (inView) {
      fetchMoreFilms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div
      className={`relative z-10 mx-auto flex w-full max-w-none flex-col gap-2 @container`}
    >
      <div className="grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7">
        {films.map((film) => {
          {
            /* 1024px */
          }
          {
            /* const lg = `          
          lg-max:[&_>_a_#FilmPreview]:child-5n+1:left-0 lg-max:[&_>_a_#FilmPreview]:child-5n+1:translate-x-0

          lg-max:[&_>_a_#FilmPreview]:child-5n:left-auto lg-max:[&_>_a_#FilmPreview]:child-5n:translate-x-0 lg-max:[&_>_a_#FilmPreview]:child-5n:right-0
          `; */
          }

          {
            /* 1280px */
          }
          {
            /* const xl = `
          xl:[&_>_a_#FilmPreview]:child-7n+1:left-0 xl:[&_>_a_#FilmPreview]:child-7n+1:translate-x-0

          xl:[&_>_a_#FilmPreview]:child-7n:left-auto xl:[&_>_a_#FilmPreview]:child-7n:translate-x-0 xl:[&_>_a_#FilmPreview]:child-7n:right-0
          `; */
          }

          {
            /* 1536px */
          }
          const xl2 = `
          @6xl:[&_#FilmPreview]:child-6n+1:left-0 @6xl:[&_#FilmPreview]:child-6n+1:translate-x-0

          @6xl:[&_#FilmPreview]:child-6n:left-auto @6xl:[&_#FilmPreview]:child-6n:translate-x-0 @6xl:[&_#FilmPreview]:child-6n:right-0

          @7xl:[&_#FilmPreview]:child-6n+1:left-1/2 @7xl:[&_#FilmPreview]:child-6n+1:-translate-x-1/2

          @7xl:[&_#FilmPreview]:child-6n:left-1/2 @7xl:[&_#FilmPreview]:child-6n:-translate-x-1/2 @7xl:[&_#FilmPreview]:child-6n:right-auto
          
          @7xl:[&_#FilmPreview]:child-7n+1:left-0 @7xl:[&_#FilmPreview]:child-7n+1:translate-x-0

          @7xl:[&_#FilmPreview]:child-7n:!left-auto @7xl:[&_#FilmPreview]:child-7n:!translate-x-0 @7xl:[&_#FilmPreview]:child-7n:!right-0
          `;

          return (
            <Reveal key={film.id} y={0} className={`${xl2}`}>
              <FilmCard
                film={film}
                isTvPage={isQueryParams ? film.media_type === "tv" : isTvPage}
              />
            </Reveal>
          );
        })}
      </div>

      {totalSearchPages > currentSearchPage && (
        <div className={`mt-4 flex items-center justify-center`}>
          <span
            ref={loadMoreBtn}
            className="loading loading-spinner loading-md"
          ></span>
        </div>
      )}
    </div>
  );
}
