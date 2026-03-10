"use client";

import React from "react";
import useSWR from "swr";
import Search from "@/components/Search/";
import Filters from "@/components/Search/Filter";
import { tvGenres } from "@/data/tv-genres";
import { languages } from "@/data/languages";
import { axios } from "@/lib/axios";

export default function ClientTvSearch() {
  const { data: minYearData } = useSWR(
    `/api/discover/tv?sort_by=first_air_date.asc`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const { data: maxYearData } = useSWR(
    `/api/discover/tv?sort_by=first_air_date.desc`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const isReady = minYearData && maxYearData;
  
  const defaultMaxYear = new Date().getFullYear() + 1;
  const minYear = isReady ? new Date(minYearData.results[0]?.first_air_date).getFullYear() : 1944;
  let maxYear = isReady ? new Date(maxYearData.results[0]?.first_air_date).getFullYear() : defaultMaxYear;
  
  if (maxYear > defaultMaxYear) {
      maxYear = defaultMaxYear;
  }

  return (
    <div className={`flex gap-4 lg:px-4`}>
      <h1 className="sr-only">Search TV Shows</h1>

      {isReady ? (
        <>
          <Filters
            type={"tv"}
            genresData={tvGenres}
            minYear={minYear}
            maxYear={maxYear}
            languagesData={languages}
          />
          <Search
            type={`tv`}
            genresData={tvGenres}
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
