"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import FilmCard from "./Card";
import { fetchData } from "@/lib/fetch";
import Reveal from "../Layout/Reveal";
import { useInView } from "react-intersection-observer";

export default function FilmGrid({ id, films, title, genres, sort = "DESC" }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  // const loadMoreBtn = useRef(null);

  // Is in viewport?
  // const isLoadMoreBtnInViewport = useIsInViewport(loadMoreBtn);
  const { ref: loadMoreBtn, inView, entry } = useInView();

  const [currentSearchPage, setCurrentSearchPage] = useState(films.page);
  const [totalSearchPages, setTotalSearchPages] = useState(films.total_pages);
  const [filmsData, setFilmsData] = useState(films.results);

  const fetchMoreFilms = async () => {
    try {
      const nextPage = currentSearchPage + 1;

      const response = await fetchData({
        endpoint: `/${!isTvPage ? `movie` : `tv`}/${id}/recommendations`,
        queryParams: {
          language: "en-US",
          page: nextPage,
        },
      });

      const isDuplicate = (film) =>
        filmsData.some((prevFilm) => prevFilm.id === film.id);

      const filteredFilms = response.results.filter(
        (film) => !isDuplicate(film),
      );

      setFilmsData((prevMovies) => [...prevMovies, ...filteredFilms]);
      setCurrentSearchPage(response.page);
    } catch (error) {
      console.log(`Error fetching more films:`, error);
    }
  };

  // Use Effect for load more button is in viewport
  useEffect(() => {
    if (inView) {
      fetchMoreFilms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <section
      id={title}
      className={`mx-auto flex w-full max-w-none flex-col gap-2 p-4`}
    >
      <div className="flex items-end gap-4">
        <Reveal>
          <h2 className="text-lg font-bold md:text-2xl">{title}</h2>{" "}
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-2 md:!grid-cols-4 lg:!grid-cols-5 xl:!grid-cols-7 xs:grid-cols-3">
        {filmsData.map((film) => {
          {
            /* 1024px */
          }
          const lg = `          
          lg-max:[&_>_a_#FilmPreview]:child-5n+1:left-0 lg-max:[&_>_a_#FilmPreview]:child-5n+1:translate-x-0

          lg-max:[&_>_a_#FilmPreview]:child-5n:left-auto lg-max:[&_>_a_#FilmPreview]:child-5n:translate-x-0 lg-max:[&_>_a_#FilmPreview]:child-5n:right-0
          `;

          {
            /* 1280px */
          }
          const xl = `
          xl:[&_>_a_#FilmPreview]:child-7n+1:left-0 xl:[&_>_a_#FilmPreview]:child-7n+1:translate-x-0

          xl:[&_>_a_#FilmPreview]:child-7n:left-auto xl:[&_>_a_#FilmPreview]:child-7n:translate-x-0 xl:[&_>_a_#FilmPreview]:child-7n:right-0
          `;

          {
            /* 1536px */
          }
          {
            /* const xl2 = `
          2xl-max:[&_>_a_#FilmPreview]:child-6n+1:left-0 2xl-max:[&_>_a_#FilmPreview]:child-6n+1:translate-x-0

          2xl-max:[&_>_a_#FilmPreview]:child-6n:left-auto 2xl-max:[&_>_a_#FilmPreview]:child-6n:translate-x-0 2xl-max:[&_>_a_#FilmPreview]:child-6n:right-0
          `; */
          }

          return (
            <Reveal key={film.id} className={`${lg} ${xl}`}>
              <FilmCard film={film} isTvPage={isTvPage} />
            </Reveal>
          );
        })}
      </div>

      {totalSearchPages > currentSearchPage && (
        <section className={`mt-4 flex items-center justify-center`}>
          <button
            ref={loadMoreBtn}
            onClick={fetchMoreFilms}
            className="pointer-events-none aspect-square w-[30px] text-white"
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
        setIsIntersecting(entry.isIntersecting),
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);

  return isIntersecting;
}
