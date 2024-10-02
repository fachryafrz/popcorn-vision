/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { IonIcon } from "@ionic/react";
import { useEffect, useState, useMemo, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/Layout/Navbar";
import Filters from "@/components/Search/Filter";
import SearchSort from "@/components/Search/Sort";
import { closeCircle, filter } from "ionicons/icons";
import axios from "axios";
import FilmGrid from "../Film/Grid";
import numeral from "numeral";
import { fetchData } from "@/lib/fetch";
import { USER_LOCATION } from "@/lib/constants";

export default function Search({
  type = "movie",
  genresData,
  languagesData,
  minYear,
  maxYear,
}) {
  const isTvPage = type === "tv";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isQueryParams = searchParams.get("query");
  const isThereAnyFilter = Object.keys(Object.fromEntries(searchParams)).length;

  // State
  const [loading, setLoading] = useState(true);
  const [films, setFilms] = useState();
  const [notAvailable, setNotAvailable] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [totalSearchResults, setTotalSearchResults] = useState();
  const [totalSearchPages, setTotalSearchPages] = useState({});
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle React-Select Input Styles
  const inputStyles = useMemo(() => {
    return {
      placeholder: (styles) => ({
        ...styles,
        fontSize: "14px",
        whiteSpace: "nowrap",
      }),
      control: (styles) => ({
        ...styles,
        color: "#fff",
        backgroundColor: "#131720",
        borderWidth: "1px",
        borderColor: "#79808B",
        borderRadius: "1.5rem",
        cursor: "text",
      }),
      input: (styles, { isDisabled }) => ({
        ...styles,
        color: "#fff",
      }),
      dropdownIndicator: (styles) => ({
        ...styles,
        display: "none",
      }),
      indicatorSeparator: (styles) => ({
        ...styles,
        display: "none",
      }),
      menu: (styles) => ({
        ...styles,
        backgroundColor: "#131720",
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          color: "#fff",
          backgroundColor: isSelected ? "rgba(255,255,255,0.1)" : "#131720",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.05)",
          },
        };
      },
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: "9999px",
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: "#fff",
      }),
      multiValueRemove: (styles) => ({
        ...styles,
        color: "#fff",
        borderRadius: "9999px",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.1)",
        },
      }),
      clearIndicator: (styles) => ({
        ...styles,
        display: "block",
        "&:hover": {
          color: "#fff",
        },
        cursor: "pointer",
      }),
      singleValue: (styles) => ({
        ...styles,
        color: "#fff",
      }),
    };
  }, []);

  // Handle not available
  const handleNotAvailable = () => {
    setNotAvailable(
      "Filters cannot be applied, please clear the search input.",
    );
  };
  const handleClearNotAvailable = () => {
    setNotAvailable("");
  };

  // Fetch more films based on search or selected genres
  const fetchMoreFilms = async () => {
    try {
      let response;
      const nextPage = currentSearchPage + 1;

      if (!searchParams.get("query")) {
        const params = {
          media_type: type,
          page: nextPage,
          ...Object.fromEntries(searchParams),
        };

        // NOTE: Di search page harus pakai localStorage agar ketika di refresh tidak error
        const userLocation = localStorage.getItem(USER_LOCATION);

        if (searchParams.get("watch_providers") && userLocation) {
          params.watch_region = JSON.parse(userLocation).country_code;
        }

        const data = await fetchData({
          endpoint: `/api/search/filter`,
          queryParams: params,
          baseURL: process.env.NEXT_PUBLIC_APP_URL,
        });

        response = data;
      }

      if (searchParams.get("query")) {
        const params = {
          query: searchParams.get("query"),
          page: nextPage,
        };

        const data = await fetchData({
          endpoint: `/api/search/query`,
          queryParams: params,
          baseURL: process.env.NEXT_PUBLIC_APP_URL,
        });

        const filteredFilms = data.results.filter(
          (film) => film.media_type === "movie" || film.media_type === "tv",
        );

        response = { ...data, results: filteredFilms };
      }

      const combinedFilms = [...films, ...response.results];

      const uniqueFilms = combinedFilms.filter(
        (film, index, self) =>
          index === self.findIndex((t) => t.id === film.id),
      );

      setLoading(false);
      setFilms(uniqueFilms);
      // setTotalSearchResults(response.total_results);
      setTotalSearchPages(response.total_pages);
      setCurrentSearchPage(response.page);
    } catch (error) {
      console.log(`Error fetching more films:`, error);
    }
  };

  // Use Effect for Search
  useEffect(() => {
    setLoading(true);

    const searchByFilter = async () => {
      const params = {
        media_type: type,
        ...Object.fromEntries(searchParams),
      };

      // NOTE: Di search page harus pakai localStorage agar ketika di refresh tidak error
      const userLocation = localStorage.getItem(USER_LOCATION);

      if (searchParams.get("watch_providers") && userLocation) {
        params.watch_region = JSON.parse(userLocation).country_code;
      }

      const data = await fetchData({
        endpoint: `/api/search/filter`,
        queryParams: params,
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
      });

      const uniqueFilms = data.results.filter(
        (film, index, self) =>
          index === self.findIndex((t) => t.id === film.id),
      );

      setFilms(uniqueFilms);
      setLoading(false);
      setTotalSearchPages(data.total_pages);
      setCurrentSearchPage(1);
      setTotalSearchResults(data.total_results);
    };

    const searchByQuery = async () => {
      const params = {
        query: searchParams.get("query"),
      };

      const data = await fetchData({
        endpoint: `/api/search/query`,
        queryParams: params,
        baseURL: process.env.NEXT_PUBLIC_APP_URL,
      });

      const filteredMovies = data.results.filter(
        (film) => film.media_type === "movie" || film.media_type === "tv",
      );

      const uniqueFilms = filteredMovies.filter(
        (film, index, self) =>
          index === self.findIndex((t) => t.id === film.id),
      );

      setFilms(uniqueFilms);
      setLoading(false);
      setTotalSearchPages(data.total_pages);
      setCurrentSearchPage(1);
      setTotalSearchResults(data.total_results);
    };

    if (!searchParams.get("query")) {
      searchByFilter();
    }

    if (searchParams.get("query")) {
      searchByQuery();
    }
  }, [searchParams, type]);

  useEffect(() => {
    window.addEventListener("scroll", function () {
      if (window.scrollY >= 1) {
        setIsScrolled(true);
      } else if (window.scrollY < 1) {
        setIsScrolled(false);
      }
    });
  }, []);

  return (
    <div className={`flex lg:px-4`}>
      <h1 className="sr-only">
        {!isTvPage ? `Search Movies` : `Search TV Series`}
      </h1>

      <Suspense>
        <Filters
          type={type}
          inputStyles={inputStyles}
          genresData={genresData}
          isFilterActive={isFilterActive}
          setIsFilterActive={setIsFilterActive}
          minYear={minYear}
          maxYear={maxYear}
          languagesData={languagesData}
          handleNotAvailable={handleNotAvailable}
          handleClearNotAvailable={handleClearNotAvailable}
        />
      </Suspense>

      <div className={`flex w-full flex-col gap-2 p-4 @container lg:pr-0`}>
        {/* Options */}
        <section
          className={`sticky top-[66px] z-40 -mx-4 -mt-4 flex items-center gap-2 bg-base-100  px-4 py-2 lg:flex-row lg:justify-between ${isScrolled ? `bg-opacity-85 backdrop-blur` : `bg-opacity-0`}`}
        >
          {/* Search bar */}
          <div className={`w-full lg:hidden`}>
            <SearchBar placeholder={`Tap to search`} />
          </div>

          {/* <div className={`lg:w-full`}>
            <h1 className={`text-2xl font-bold capitalize`}>Search</h1>
          </div> */}

          {/* Clear filters */}
          {isThereAnyFilter > 0 && (
            <Suspense>
              <div
                className={`flex min-w-fit flex-row-reverse flex-wrap items-center gap-2 lg:h-[42px]`}
              >
                <button
                  onClick={() => router.push(`${pathname}`)}
                  className={`btn btn-circle btn-secondary border-none bg-opacity-20 hocus:btn-error md:btn-block lg:btn-sm hocus:text-white md:!h-full md:px-2 md:pr-4 lg:w-fit`}
                >
                  <IonIcon icon={closeCircle} className={`text-2xl`} />
                  <span className={`hidden whitespace-nowrap text-sm md:block`}>
                    Clear filters
                  </span>
                </button>
              </div>
            </Suspense>
          )}

          <div
            className={`flex min-w-fit flex-wrap items-center justify-between gap-2 lg:w-full`}
          >
            {/* <div className={`flex items-center justify-center gap-2`}> */}
            {/* Filter button */}
            <button
              onClick={() =>
                isQueryParams ? handleNotAvailable() : setIsFilterActive(true)
              }
              onMouseLeave={() => handleClearNotAvailable()}
              className={`btn btn-circle btn-secondary border-none bg-opacity-20 md:btn-block hocus:bg-opacity-50 md:px-4 lg:hidden`}
            >
              <span className="hidden md:block">Filters</span>
              <IonIcon icon={filter} className={`text-xl`} />
            </button>
            {/* </div> */}

            <div className={`hidden w-full lg:flex`}>
              <div className={`ml-auto flex items-center gap-2`}>
                {films?.length > 0 && (
                  <span className={`block text-xs font-medium`}>
                    {!isQueryParams
                      ? `Showing ${numeral(films.length).format("0,0")} of ${numeral(totalSearchResults).format("0,0")} ${!isTvPage ? "Movies" : "TV Series"}`
                      : `Showing ${numeral(films.length).format("0,0")} Films`}
                  </span>
                )}

                <SearchSort
                  handleNotAvailable={handleNotAvailable}
                  handleClearNotAvailable={handleClearNotAvailable}
                  inputStyles={inputStyles}
                  setIsFilterActive={setIsFilterActive}
                />
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <>
            {/* Loading films */}
            <section
              className={`grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7`}
            >
              {[...Array(20).keys()].map((a) => (
                <span
                  key={a}
                  className="aspect-poster animate-pulse rounded-xl bg-gray-400 bg-opacity-20"
                ></span>
              ))}
            </section>
          </>
        )}

        {!loading && films?.length > 0 && (
          <section>
            <FilmGrid
              films={films}
              fetchMoreFilms={fetchMoreFilms}
              currentSearchPage={currentSearchPage}
              totalSearchPages={totalSearchPages}
            />
          </section>
        )}

        {!loading && films?.length === 0 && (
          <>
            {/* No film */}
            <section>
              <span>No film found</span>
            </section>
          </>
        )}
      </div>

      {notAvailable && (
        <div className="toast toast-start z-[60] min-w-0 max-w-full whitespace-normal">
          <div className="alert alert-error">
            <span style={{ textWrap: `balance` }}>{notAvailable}</span>
          </div>
        </div>
      )}
    </div>
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
        // setVariable(defaultValue);
        // if (setVariableSlider) setVariableSlider(defaultValue);
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
