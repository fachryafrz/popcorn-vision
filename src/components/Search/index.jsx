"use client";

import { IonIcon } from "@ionic/react";
import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/Layout/Navbar";
import Filters from "@/components/Search/Filter";
import SearchSort from "@/components/Search/Sort";
import { closeCircle, optionsOutline } from "ionicons/icons";
import FilmGrid from "../Film/Grid";
import numeral from "numeral";
import { fetchData } from "@/lib/fetch";
import useSWR from "swr";
import { useLocation } from "@/zustand/location";

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
  const isThereAnyFilter = Object.keys(Object.fromEntries(searchParams)).filter(
    (key) => key !== "query",
  ).length;

  // State
  const [notAvailable, setNotAvailable] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Global State
  const { location } = useLocation();

  // SWR configuration
  const fetcher = async (url) => {
    const response = await fetchData({
      endpoint: url,
      baseURL: process.env.NEXT_PUBLIC_APP_URL,
    });
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

  // Handle not available
  const handleNotAvailable = () => {
    setNotAvailable(
      "Filters cannot be applied, please clear the search input.",
    );
  };
  const handleClearNotAvailable = () => {
    setNotAvailable("");
  };

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
    if (isQueryParams) {
      router.push(`/search?query=${isQueryParams}`);
    } else {
      router.push(`/search`);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    if (window.innerWidth < 1280) {
      setIsFilterActive(false);
    } else {
      setIsFilterActive(true);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div className={`flex lg:px-4`}>
      <h1 className="sr-only">
        {!isTvPage ? `Search Movies` : `Search TV Shows`}
      </h1>

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

      <div
        className={`flex w-full flex-col gap-2 p-4 pb-0 transition-all duration-300 @container lg:pr-0 ${!isFilterActive ? `lg:-ml-[300px] lg:pl-0` : `lg:pl-4`}`}
      >
        {/* Options */}
        <section
          className={`sticky top-[66px] z-40 -mx-4 -mt-4 flex items-center gap-2 bg-base-100 bg-opacity-85 px-4 py-2 backdrop-blur lg:flex-row lg:justify-between`}
        >
          {/* Search bar */}
          <div className={`flex-grow lg:hidden`}>
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
                  <IonIcon icon={closeCircle} className={`text-2xl`} />
                  <span className={`hidden whitespace-nowrap text-sm md:block`}>
                    Reset
                  </span>
                </button>
              </div>
            )}

            {/* Filter button */}
            <button
              onClick={() =>
                isFilterActive
                  ? setIsFilterActive(false)
                  : setIsFilterActive(true)
              }
              onMouseLeave={() => handleClearNotAvailable()}
              className={`btn btn-secondary aspect-square rounded-full border-none bg-opacity-20 !px-0 lg:btn-sm hocus:bg-opacity-50 lg:h-[42px]`}
            >
              {/* <span className="hidden md:block">Filters</span> */}
              <IonIcon icon={optionsOutline} className={`text-xl`} />
            </button>
          </div>

          <div className={`hidden flex-grow justify-end lg:flex`}>
            <div className={`flex items-center gap-2`}>
              {films?.length > 0 && (
                <span className={`block text-xs font-medium`}>
                  {!isQueryParams
                    ? `Showing ${numeral(films.length).format("0,0")} of ${numeral(totalSearchResults).format("0,0")} ${!isTvPage ? "Movies" : "TV Shows"}`
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
        </section>

        <section>
          <FilmGrid
            films={films}
            fetchMoreFilms={fetchMoreFilms}
            currentSearchPage={currentSearchPage}
            totalSearchPages={totalSearchPages}
            loading={loading}
          />
        </section>

        {/* No film */}
        {!loading && films?.length === 0 && (
          <section>
            <span>No film found</span>
          </section>
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
