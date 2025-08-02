"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import FilmGrid from "./Grid";
import axios from "axios";

export default function Recommendation({
  id,
  similar,
  recommendations,
  title,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [currentSearchPage, setCurrentSearchPage] = useState(
    recommendations?.page || similar?.page,
  );
  const [totalSearchPages, setTotalSearchPages] = useState(
    recommendations?.total_pages
      ? recommendations?.total_pages
      : similar?.total_pages,
  );
  const [filmsData, setFilmsData] = useState(
    recommendations?.results.length > 0
      ? recommendations?.results
      : similar?.results,
  );
  const [isFinished, setIsFinished] = useState(
    recommendations?.results.length > 0 ? false : true,
  );

  const fetchMoreFilms = async () => {
    try {
      let nextPage = currentSearchPage + 1;
      let endpoint = !isFinished ? `recommendations` : `similar`;

      const response = await axios
        .get(`/api/${!isTvPage ? `movie` : `tv`}/${id}/${endpoint}`, {
          params: {
            language: "en-US",
            page: nextPage,
          },
        })
        .then(({ data }) => data);

      const filteredFilms = response?.results.filter((film) => {
        return !filmsData.some((existingFilm) => existingFilm.id === film.id);
      });

      setFilmsData((prevMovies) => [...prevMovies, ...filteredFilms]);
      setCurrentSearchPage(response?.page);
      setTotalSearchPages(response?.total_pages);
    } catch (error) {
      console.error(`Error fetching more films:`, error);
    }
  };

  useEffect(() => {
    if (currentSearchPage === totalSearchPages && !isFinished) {
      setIsFinished(true);
      setCurrentSearchPage(0);
      setTotalSearchPages(similar?.total_pages);
    }
  }, [currentSearchPage, isFinished, similar, totalSearchPages]);

  return (
    <section
      id={title}
      className={`mx-auto flex w-full max-w-none flex-col gap-2 p-4`}
    >
      <div className="flex items-end gap-4">
        <h2 className="text-lg font-bold md:text-2xl">{title}</h2>{" "}
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
