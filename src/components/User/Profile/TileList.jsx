"use client";

import { CollectionItem } from "@/components/Film/Details/Collection";
import { tmdb_session_id } from "@/lib/constants";
import { fetchData } from "@/lib/fetch";
import { useCookies } from "next-client-cookies";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function TileList({
  title,
  section,
  films,
  type = "movie",
  user,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTvPage = pathname.startsWith("/tv");
  const cookies = useCookies();

  const { ref: loadMoreBtn, inView, entry } = useInView();
  const [currentSearchPage, setCurrentSearchPage] = useState(films.page);
  const [totalSearchPages, setTotalSearchPages] = useState(films.total_pages);
  const [filmsData, setFilmsData] = useState(films.results);
  const [sort, setSort] = useState();
  const [order, setOrder] = useState();

  const sortedFilms = [...filmsData].sort((a, b) => {
    if (sort === "created_at") {
      if (order === "asc") {
        return -1;
      } else if (order === "desc") {
        return 1;
      }
    }

    if (sort === "rating") {
      const ratingA = a.rating ?? a.vote_average;
      const ratingB = b.rating ?? b.vote_average;

      if (order === "asc") {
        return ratingA - ratingB;
      } else if (order === "desc") {
        return ratingB - ratingA;
      }
    }

    if (sort === "popularity") {
      const popularityA = a.popularity;
      const popularityB = b.popularity;

      if (order === "asc") {
        return popularityA - popularityB;
      } else if (order === "desc") {
        return popularityB - popularityA;
      }
    }

    if (sort === "release_date") {
      const dateA = new Date(!isTvPage ? a.release_date : a.first_air_date);
      const dateB = new Date(!isTvPage ? b.release_date : b.first_air_date);

      if (order === "asc") {
        return dateA - dateB;
      } else if (order === "desc") {
        return dateB - dateA;
      }
    }
  });

  const fetchMoreFilms = async () => {
    try {
      const nextPage = currentSearchPage + 1;

      // NOTE: Session ID still visible in the Network DevTools
      const response = await fetchData({
        endpoint: `/account/${user.id}/${section}/${type === "movie" ? "movies" : "tv"}`,
        queryParams: {
          language: "en-US",
          page: nextPage,
          session_id: cookies.get(tmdb_session_id),
          sort_by: "created_at.desc",
        },
      });

      const isDuplicate = (film) =>
        filmsData.some((prevFilm) => prevFilm.id === film.id);

      const filteredFilms = response.results.filter(
        (film) => !isDuplicate(film),
      );

      const updatedFilms = [...filmsData, ...filteredFilms];

      // let newFilms = response.results.filter((film) => !isDuplicate(film));

      // // Sort new films based on current sort and order criteria
      // newFilms = newFilms.sort((a, b) => {
      //   // Sorting logic here, similar to what you have in the sortedFilms array
      // });

      // const updatedFilms = [...filmsData, ...newFilms].sort((a, b) => {
      //   // Sorting logic here again to sort the entire array
      // });

      setFilmsData(updatedFilms);
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

  useEffect(() => {
    if (searchParams.get("sort_by")) {
      const sortParam = searchParams.get("sort_by");

      setSort(sortParam);
    }

    if (searchParams.get("order")) {
      const orderParam = searchParams.get("order");

      setOrder(orderParam);
    }
  }, [searchParams]);

  return (
    <section className={`rounded-xl bg-gray-400 bg-opacity-5 p-2 py-4`}>
      <h2 className={`mb-4 text-center text-lg font-bold md:text-2xl`}>
        {title}
      </h2>

      <ul className={`flex flex-col gap-1`}>
        {sortedFilms.map((film, i) => (
          <li key={film.id}>
            <CollectionItem
              index={i}
              item={film}
              type={type}
              shouldFetch={false}
              userRating={film.rating}
            />
          </li>
        ))}

        {sortedFilms.length === 0 && (
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
