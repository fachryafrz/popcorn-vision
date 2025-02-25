"use client";

import { CollectionItem } from "@/components/Film/Details/Collection";
import SkeletonCollection from "@/components/Skeleton/Collection";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWR from "swr";

export default function TileList({ title, section, type = "movie", user }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTvPage = pathname.startsWith("/tv");
  const cookies = useCookies();

  const {
    data: films,
    isLoading,
    mutate,
  } = useSWR(
    `/api/account/${user.id}/${section}/${type === "tv" ? "tv" : "movies"}`,
    (endpoint) =>
      axios
        .get(endpoint, {
          params: {
            sort_by: "created_at.desc",
          },
        })
        .then(({ data }) => data),
  );

  const { ref: loadMoreBtn, inView, entry } = useInView();
  const [currentSearchPage, setCurrentSearchPage] = useState(0);
  const [totalSearchPages, setTotalSearchPages] = useState();
  const [filmsData, setFilmsData] = useState();
  const [sort, setSort] = useState();
  const [order, setOrder] = useState();

  useEffect(() => {
    setCurrentSearchPage(films?.page);
    setTotalSearchPages(films?.total_pages);
    setFilmsData(films?.results);
  }, [films]);

  const sortedFilms =
    films?.results &&
    [...films?.results].sort((a, b) => {
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

      const { data: response } = await axios.get(
        `/api/account/${user.id}/${section}/${type === "tv" ? "tv" : "movies"}`,
        {
          params: {
            language: "en-US",
            page: nextPage,
            sort_by: "created_at.desc",
          },
        },
      );

      const isDuplicate = (film) =>
        filmsData?.some((prevFilm) => prevFilm.id === film.id);

      const filteredFilms = response.results.filter(
        (film) => !isDuplicate(film),
      );

      const updatedFilms = filmsData && [...filmsData, ...filteredFilms];

      // let newFilms = response.results.filter((film) => !isDuplicate(film));

      // // Sort new films based on current sort and order criteria
      // newFilms = newFilms?.sort((a, b) => {
      //   // Sorting logic here, similar to what you have in the sortedFilms array
      // });

      // const updatedFilms = [...filmsData, ...newFilms].sort((a, b) => {
      //   // Sorting logic here again to sort the entire array
      // });

      setFilmsData(updatedFilms);
      setCurrentSearchPage(response.page);
    } catch (error) {
      console.error(`Error fetching more films:`, error);
    }
  };

  useEffect(() => {
    if (!inView) return;

    fetchMoreFilms();
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
    <section
      className={`-mx-4 bg-gray-400 bg-opacity-5 p-2 py-4 md:mx-0 md:rounded-xl`}
    >
      <h2 className={`mb-4 text-center text-lg font-bold md:text-2xl`}>
        {title}
      </h2>

      <ul className={`flex flex-col gap-1`}>
        {isLoading &&
          [...Array(5).keys()].map((_, i) => (
            <li key={i}>
              <SkeletonCollection />
            </li>
          ))}

        {sortedFilms?.map((film, i) => (
          <li key={film.id}>
            <CollectionItem
              index={i}
              item={film}
              type={type}
              userRating={film.rating}
            />
          </li>
        ))}

        {sortedFilms?.length === 0 && (
          <li className={`text-center`}>
            No {type === "tv" ? "TV Shows" : "Movies"} found.
          </li>
        )}

        {totalSearchPages > currentSearchPage &&
          [...Array(3).keys()].map((_, i) => (
            <li key={i} ref={i === 0 ? loadMoreBtn : null}>
              <SkeletonCollection />
            </li>
          ))}
      </ul>
    </section>
  );
}
