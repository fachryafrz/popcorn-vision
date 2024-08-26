"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import FilmCard from "./Card";
import { fetchData } from "@/lib/fetch";
import Reveal from "../Layout/Reveal";
import { useInView } from "react-intersection-observer";
import FilmGrid from "./Grid";

export default function Recommendation({
  id,
  similar,
  recommendations,
  title,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [currentSearchPage, setCurrentSearchPage] = useState(
    recommendations.page ? recommendations.page : similar.page,
  );
  const [totalSearchPages, setTotalSearchPages] = useState(
    recommendations.total_pages
      ? recommendations.total_pages
      : similar.total_pages,
  );
  const [filmsData, setFilmsData] = useState(
    recommendations.results.length > 0
      ? recommendations.results
      : similar.results,
  );
  const [isFinished, setIsFinished] = useState(
    recommendations.results.length > 0 ? false : true,
  );

  const fetchMoreFilms = async () => {
    try {
      let nextPage = currentSearchPage + 1;
      let endpoint = !isFinished ? `recommendations` : `similar`;

      const response = await fetchData({
        endpoint: `/${!isTvPage ? `movie` : `tv`}/${id}/${endpoint}`,
        queryParams: {
          language: "en-US",
          page: nextPage,
        },
      });

      const filteredFilms = response.results.filter((film) => {
        return !filmsData.some((existingFilm) => existingFilm.id === film.id);
      });

      setFilmsData((prevMovies) => [...prevMovies, ...filteredFilms]);
      setCurrentSearchPage(response.page);
      setTotalSearchPages(response.total_pages);
    } catch (error) {
      console.log(`Error fetching more films:`, error);
    }
  };

  useEffect(() => {
    if (currentSearchPage === totalSearchPages && !isFinished) {
      setIsFinished(true);
      setCurrentSearchPage(0);
      setTotalSearchPages(similar.total_pages);
    }
  }, [currentSearchPage, isFinished, similar, totalSearchPages]);

  return (
    <section
      id={title}
      className={`mx-auto flex w-full max-w-none flex-col gap-2 p-4`}
    >
      <div className="flex items-end gap-4">
        <Reveal y={0}>
          <h2 className="text-lg font-bold md:text-2xl">{title}</h2>{" "}
        </Reveal>
      </div>

      <FilmGrid
        films={filmsData}
        fetchMoreFilms={fetchMoreFilms}
        currentSearchPage={currentSearchPage}
        totalSearchPages={totalSearchPages}
      />
    </section>
  );
}
