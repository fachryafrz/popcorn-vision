"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FilmCard from "./FilmCard";
import { IsInViewport } from "@/app/lib/IsInViewport";
import { fetchData } from "../api/route";
import Reveal from "../lib/Reveal";

export default function FilmGrid({ id, films, title, genres, sort = "DESC" }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const loadMoreBtn = useRef(null);

  // Is in viewport?
  const isLoadMoreBtnInViewport = useIsInViewport(loadMoreBtn);

  let [currentSearchPage, setCurrentSearchPage] = useState(films.page);
  const [totalSearchPages, setTotalSearchPages] = useState(films.total_pages);
  const [filmsData, setFilmsData] = useState(films.results);

  const fetchMoreFilms = async () => {
    setCurrentSearchPage((prevPage) => prevPage + 1);

    try {
      const response = await fetchData({
        endpoint: `/${!isTvPage ? `movie` : `tv`}/${id}/recommendations`,
        queryParams: {
          language: "en-US",
          page: currentSearchPage,
        },
      });

      const isDuplicate = (film) =>
        filmsData.some((prevFilm) => prevFilm.id === film.id);

      const filteredFilms = response.results.filter(
        (film) => !isDuplicate(film)
      );

      setFilmsData((prevMovies) => [...prevMovies, ...filteredFilms]);
    } catch (error) {
      console.log(`Error fetching more films:`, error);
    }
  };

  // Use Effect for load more button is in viewport
  useEffect(() => {
    if (isLoadMoreBtnInViewport) {
      setTimeout(() => {
        loadMoreBtn.current.click();
      }, 500);
    }
  }, [isLoadMoreBtnInViewport]);

  return (
    <section
      id={title}
      className={`w-full max-w-none mx-auto p-4 flex flex-col gap-2`}
    >
      <div className="flex gap-4 items-end">
        <Reveal>
          <h2 className="font-bold text-lg md:text-2xl">{title}</h2>{" "}
        </Reveal>
      </div>

      <div className="grid gap-2 grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {filmsData.map((film) => {
          const filmGenres =
            film.genre_ids && genres
              ? film.genre_ids.map((genreId) =>
                  genres.find((genre) => genre.id === genreId)
                )
              : [];

          {
            /* NOTE: Harus atur posisi yg disebelah kiri juga */
          }
          const first = `[&_#FilmPreview]:first:!left-0 [&_#FilmPreview]:first:!translate-x-0`;
          const fifth = `lg:[&_#FilmPreview]:fifth:!left-auto lg:[&_#FilmPreview]:fifth:!translate-x-0 lg:[&_#FilmPreview]:fifth:!right-0 xl:[&_#FilmPreview]:fifth:!left-1/2 xl:[&_#FilmPreview]:fifth:!-translate-x-1/2 xl:[&_#FilmPreview]:fifth:!right-auto`;
          const seventh = `xl:[&_#FilmPreview]:seventh:!left-auto xl:[&_#FilmPreview]:seventh:!translate-x-0 xl:[&_#FilmPreview]:seventh:!right-0`;

          return (
            <Reveal
              key={film.id}
              // className={`${first} ${fifth} ${seventh}`}
            >
              <FilmCard film={film} genres={filmGenres} isTvPage={isTvPage} />{" "}
            </Reveal>
          );
        })}
      </div>

      {totalSearchPages > currentSearchPage && (
        <section className={`flex items-center justify-center mt-4`}>
          <button
            ref={loadMoreBtn}
            onClick={() => fetchMoreFilms((currentSearchPage += 1))}
            className="text-white aspect-square w-[30px] pointer-events-none"
          >
            <span className="loading loading-spinner loading-md"></span>
          </button>
        </section>
      )}
    </section>
  );
}

export function useIsInViewport(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const intersectionObserverSupported = "IntersectionObserver" in window;

    if (intersectionObserverSupported && ref.current) {
      const observer = new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);

  return isIntersecting;
}
