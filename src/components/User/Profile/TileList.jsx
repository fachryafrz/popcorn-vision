"use client";

import { CollectionItem } from "@/components/Film/Details/Collection";
import { fetchData } from "@/lib/fetch";
import { useCookies } from "next-client-cookies";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function TileList({
  title,
  section,
  films,
  type = "movie",
  user,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const cookies = useCookies();

  const { ref: loadMoreBtn, inView, entry } = useInView();
  const [currentSearchPage, setCurrentSearchPage] = useState(films.page);
  const [totalSearchPages, setTotalSearchPages] = useState(films.total_pages);
  const [filmsData, setFilmsData] = useState(films.results);

  const fetchMoreFilms = async () => {
    try {
      const nextPage = currentSearchPage + 1;

      // NOTE: Session ID still visible in the Network DevTools
      const response = await fetchData({
        endpoint: `/account/${user.id}/${section}/${type === "movie" ? "movies" : "tv"}`,
        queryParams: {
          language: "en-US",
          page: nextPage,
          session_id: cookies.get("tmdb.session_id"),
          sort_by: "created_at.desc",
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

  useEffect(() => {
    if (inView) {
      fetchMoreFilms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <section className={`rounded-xl bg-gray-400 bg-opacity-5 p-2 py-4`}>
      <h2 className={`mb-4 text-center text-lg font-bold md:text-2xl`}>
        {title}
      </h2>

      <ul className={`flex flex-col gap-1`}>
        {filmsData.map((film, i) => (
          <li key={film.id}>
            <CollectionItem
              index={i}
              item={film}
              type={type}
              shouldFetch={false}
            />
          </li>
        ))}

        {filmsData.length === 0 && (
          <li className={`text-center`}>
            No {type === "tv" ? "TV Series" : "Movies"} found.
          </li>
        )}

        {totalSearchPages > currentSearchPage && (
          <li className={`mt-2 text-center`}>
            <button
              ref={loadMoreBtn}
              onClick={fetchMoreFilms}
              className="pointer-events-none aspect-square w-[30px] text-white"
            >
              <span className="loading loading-spinner loading-md"></span>
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
