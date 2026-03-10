"use client";

import React from "react";
import useSWR from "swr";
import Search from "@/components/Search/";
import Filters from "@/components/Search/Filter";
import { movieGenres } from "@/data/movie-genres";
import { languages } from "@/data/languages";
import dayjs from "dayjs";
import { axios } from "@/lib/axios";

export default function ClientMovieSearch() {
  const { data: minYearData } = useSWR(
    `/api/discover/movie?sort_by=primary_release_date.asc`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const { data: maxYearData } = useSWR(
    `/api/discover/movie?sort_by=primary_release_date.desc`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const isReady = minYearData && maxYearData;
  const minYear = isReady ? dayjs(minYearData.results[0]?.release_date).year() : 1887;
  const maxYear = isReady ? dayjs(maxYearData.results[0]?.release_date).year() : new Date().getFullYear();

  return (
    <div className={`flex gap-4 lg:px-4`}>
      <h1 className="sr-only">Search Movies</h1>

      {isReady ? (
        <>
          <Filters
            type={"movie"}
            genresData={movieGenres}
            minYear={minYear}
            maxYear={maxYear}
            languagesData={languages}
          />
          <Search
            type={`movie`}
            genresData={movieGenres}
            languagesData={languages}
            minYear={minYear}
            maxYear={maxYear}
          />
        </>
      ) : (
        <div className="flex w-full items-center justify-center p-8">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}
    </div>
  );
}
