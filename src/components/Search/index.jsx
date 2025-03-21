"use client";

import { IonIcon } from "@ionic/react";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/Layout/SearchBar";
import SearchSort from "@/components/Search/Sort";
import { closeCircle, optionsOutline } from "ionicons/icons";
import FilmGrid from "../Film/Grid";
import numeral from "numeral";
import useSWR from "swr";
import { useLocation } from "@/zustand/location";
import { useToggleFilter } from "@/zustand/toggleFilter";
import pluralize from "pluralize";
import { useFiltersNotAvailable } from "@/zustand/filtersNotAvailable";
import axios from "axios";

export default function Search({ type = "movie" }) {
  const isTvPage = type === "tv";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filtersNotAvailable, setFiltersNotAvailable } =
    useFiltersNotAvailable();

  const isQueryParams = searchParams.get("query");
  const isThereAnyFilter = Object.keys(Object.fromEntries(searchParams)).length;

  // Global State
  const { location } = useLocation();
  const { toggleFilter, setToggleFilter } = useToggleFilter();

  // SWR configuration
  const fetcher = async (url) => {
    const response = await axios.get(url).then(({ data }) => data);

    return response;
  };

  // Prepare SWR key
  const getKey = () => {
    if (isQueryParams) {
      return `/api/search/query?query=${searchParams.get("query")}`;
    } else {
      const params = new URLSearchParams({
        media_type: type,
        ...Object.fromEntries(searchParams),
      });

      if (searchParams.get("watch_providers") && location) {
        params.append("watch_region", location.country_code);
      }

      return `/api/search/filter?${params.toString()}`;
    }
  };

  // Use SWR for data fetching
  const {
    data,
    isLoading: loading,
    mutate,
  } = useSWR(getKey, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Process data
  const films = useMemo(() => {
    if (!data) return [];
    const mediaTypes = ["movie", "tv"];
    const results = isQueryParams
      ? data.results.filter((film) => mediaTypes.includes(film.media_type))
      : data.results;
    return results.filter(
      (film, index, self) => index === self.findIndex((t) => t.id === film.id),
    );
  }, [data, isQueryParams]);

  const totalSearchResults = data?.total_results;
  const totalSearchPages = data?.total_pages;
  const currentSearchPage = data?.page || 0;

  // Fetch more films
  const fetchMoreFilms = async () => {
    const nextPage = currentSearchPage + 1;
    const newKey = `${getKey()}&page=${nextPage}`;

    const newData = await fetcher(newKey);
    mutate((prevData) => {
      if (!prevData) return newData;
      return {
        ...newData,
        results: [...prevData.results, ...newData.results],
      };
    }, false);
  };

  const handleResetFilters = () => {
    router.push(`${isTvPage ? `/tv` : ``}/search`);
  };

  return (
    <>
      <div
        className={`flex w-full flex-col gap-2 px-4 transition-all duration-300 @container lg:px-0 ${!toggleFilter ? `lg:-ml-[calc(300px+1rem)]` : ``}`}
      >
        {/* Options */}
        <section
          className={`sticky top-[66px] z-40 -mx-3 flex items-center gap-2 bg-base-100 bg-opacity-85 px-3 py-2 lg:flex-row lg:justify-between`}
        >
          {/* For blur effect, I did this way in order to make autocomplete blur work */}
          <div className={`absolute inset-0 -z-10 backdrop-blur`}></div>

          {/* Search bar */}
          <div className={`flex-grow sm:hidden`}>
            <SearchBar placeholder={`Tap to search`} />
          </div>

          <div className={`flex gap-2 lg:flex-row-reverse`}>
            {/* Clear filters */}
            {isThereAnyFilter > 0 && (
              <div
                className={`flex min-w-fit flex-row-reverse flex-wrap items-center gap-2 lg:h-[42px]`}
              >
                <button
                  onClick={handleResetFilters}
                  className={`btn btn-circle btn-secondary border-none bg-opacity-20 hocus:btn-error md:btn-block lg:btn-sm hocus:text-white md:!h-full md:px-2 md:pr-4 lg:w-fit`}
                >
                  <IonIcon
                    icon={closeCircle}
                    style={{
                      fontSize: 24,
                    }}
                  />
                  <span className={`hidden whitespace-nowrap text-sm md:block`}>
                    Reset
                  </span>
                </button>
              </div>
            )}

            {/* Filter button */}
            <button
              onClick={() =>
                toggleFilter ? setToggleFilter(false) : setToggleFilter(true)
              }
              onMouseLeave={() => setFiltersNotAvailable(false)}
              className={`btn btn-secondary aspect-square rounded-full border-none bg-opacity-20 !px-0 lg:btn-sm hocus:bg-opacity-50 lg:h-[42px]`}
            >
              {/* <span className="hidden md:block">Filters</span> */}
              <IonIcon
                icon={optionsOutline}
                style={{
                  fontSize: 20,
                }}
              />
            </button>
          </div>

          <div className={`hidden flex-grow justify-end sm:flex`}>
            <div className={`flex items-center gap-2`}>
              {films?.length > 0 && (
                <span className={`block text-xs font-medium`}>
                  {!isQueryParams
                    ? `Showing ${numeral(films.length).format("0,0")} of ${numeral(totalSearchResults).format("0,0")} ${!isTvPage ? pluralize("Movie", films.length) : pluralize("TV Show", films.length)}`
                    : `Showing ${numeral(films.length).format("0,0")} ${pluralize("Result", films.length)}`}
                </span>
              )}

              <SearchSort />
            </div>
          </div>
        </section>

        <section className={`min-h-[calc(100vh-66px-64px)]`}>
          {films?.length > 0 && (
            <FilmGrid
              films={films}
              fetchMoreFilms={fetchMoreFilms}
              currentSearchPage={currentSearchPage}
              totalSearchPages={totalSearchPages}
              loading={loading}
              initialLoading={true}
            />
          )}

          {/* No film */}
          {!loading && films?.length === 0 && (
            <div className={`grid h-full place-content-center`}>
              <span>No film found</span>
            </div>
          )}
        </section>
      </div>

      {filtersNotAvailable && (
        <div className="toast toast-start z-[60] min-w-0 max-w-full whitespace-normal">
          <div className="alert alert-error">
            <span style={{ textWrap: `balance` }}>
              Filters cannot be applied, please click reset
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function ButtonSwitcher({ icon, onClick, condition }) {
  return (
    <button
      onClick={onClick}
      className={`flex aspect-square rounded-full p-2 transition-all ${
        condition
          ? `bg-white text-base-100`
          : `bg-transparent text-white hocus:bg-base-100`
      }`}
    >
      <IonIcon icon={icon} />
    </button>
  );
}

function ButtonFilter({
  title,
  info,
  setVariable,
  defaultValue,
  setVariableSlider = null,
  searchParam,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  return (
    <button
      onClick={() => {
        current.delete(searchParam);
        const updatedSearchParams = new URLSearchParams(current.toString());
        router.push(`${pathname}?${updatedSearchParams}`);
      }}
      className={`flex items-center gap-1 rounded-full bg-gray-900 p-2 px-3 text-sm hocus:bg-red-700 hocus:line-through`}
    >
      <span>{`${title} ${info}`}</span>
    </button>
  );
}
