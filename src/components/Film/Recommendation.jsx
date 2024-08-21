"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import FilmCard from "./Card";
import { fetchData } from "@/lib/fetch";
import Reveal from "../Layout/Reveal";
import { useInView } from "react-intersection-observer";
import FilmGrid from "./Grid";

export default function Recommendation({ film, films, title }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [currentSearchPage, setCurrentSearchPage] = useState(films.page);
  const [totalSearchPages, setTotalSearchPages] = useState(films.total_pages);
  const [filmsData, setFilmsData] = useState(films.results);

  const fetchMoreFilms = async () => {
    try {
      const nextPage = currentSearchPage + 1;

      const response = await fetchData({
        endpoint: `/${!isTvPage ? `movie` : `tv`}/${film.id}/recommendations`,
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

      <FilmGrid
        films={filmsData}
        fetchMoreFilms={fetchMoreFilms}
        currentSearchPage={currentSearchPage}
        totalSearchPages={totalSearchPages}
      />
    </section>
  );
}
