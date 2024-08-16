/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { fetchData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { useEffect, useState, useMemo, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/Layout/Navbar";
import Reveal from "@/components/Layout/Reveal";
import Filters from "@/components/Search/Filter";
import { useInView } from "react-intersection-observer";
import FilmCard from "@/components/Film/Card";
import SearchSort from "@/components/Search/Sort";
import { closeCircle, filter } from "ionicons/icons";
import axios from "axios";
import { checkLocationPermission } from "@/lib/navigator";

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
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const isQueryParams = searchParams.get("query") ? true : false;
  const isThereAnyFilter = Object.keys(Object.fromEntries(searchParams)).length;

  // State
  const [loading, setLoading] = useState(true);
  const [films, setFilms] = useState();
  // const [genresData, setGenresData] = useState([]);
  const [notAvailable, setNotAvailable] = useState("");
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  // const [minYear, setMinYear] = useState();
  // const [maxYear, setMaxYear] = useState();
  const [releaseDate, setReleaseDate] = useState([minYear, maxYear]);
  const [totalSearchResults, setTotalSearchResults] = useState();
  const [totalSearchPages, setTotalSearchPages] = useState({});
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Is in viewport?
  const { ref: loadMoreBtn, inView, entry } = useInView();

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

        if (searchParams.get("watch_providers") && userLocation) {
          params.watch_region = JSON.parse(userLocation).countryCode;
        }

        const { data } = await axios.get(`/api/search/filter`, {
          params: params,
        });

        response = data;
      }

      if (searchParams.get("query")) {
        const params = {
          query: searchParams.get("query"),
          page: nextPage,
        };

        const { data } = await axios.get(`/api/search/query`, {
          params: params,
        });

        const filteredFilms = data.results.filter(
          (film) => film.media_type === "movie" || film.media_type === "tv",
        );

        response = { ...data, results: filteredFilms };
      }

      const uniqueFilms = response.results.filter(
        (film, index, self) =>
          index === self.findIndex((t) => t.id === film.id),
      );

      setLoading(false);
      setFilms((prevMovies) => [...prevMovies, ...uniqueFilms]);
      setTotalSearchResults(response.total_results);
      setTotalSearchPages(response.total_pages);
      setCurrentSearchPage(response.page);

      setTimeout(() => {
        setNotFoundMessage("No film found");
      }, 10000);
    } catch (error) {
      console.log(`Error fetching more films:`, error);
    }
  };

  // Use Effect for load more button is in viewport
  useEffect(() => {
    if (inView) {
      fetchMoreFilms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Use Effect for getting user location
  useEffect(() => {
    checkLocationPermission(setUserLocation, setLocationError);
  }, []);

  // Use Effect for Search
  useEffect(() => {
    setLoading(true);

    const searchByFilter = async () => {
      const params = {
        media_type: type,
        ...Object.fromEntries(searchParams),
      };

      if (searchParams.get("watch_providers") && userLocation) {
        params.watch_region = JSON.parse(userLocation).countryCode;
      }

      const { data } = await axios.get(`/api/search/filter`, {
        params: params,
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

      setTimeout(() => {
        setNotFoundMessage("No film found");
      }, 10000);
    };

    const searchByQuery = async () => {
      const params = {
        query: searchParams.get("query"),
      };

      const { data } = await axios.get(`/api/search/query`, {
        params: params,
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

      setTimeout(() => {
        setNotFoundMessage("No film found");
      }, 10000);
    };

    if (!searchParams.get("query")) {
      searchByFilter();
    }

    if (searchParams.get("query")) {
      searchByQuery();
    }
  }, [searchParams, type, userLocation]);

  return (
    <div className={`flex lg:px-4`}>
      <Suspense>
        <Filters
          type={type}
          isQueryParams={isQueryParams}
          router={router}
          pathname={pathname}
          searchParams={searchParams}
          current={current}
          inputStyles={inputStyles}
          genresData={genresData}
          setSearchQuery={setSearchQuery}
          isFilterActive={isFilterActive}
          setIsFilterActive={setIsFilterActive}
          releaseDate={releaseDate}
          minYear={minYear}
          maxYear={maxYear}
          languagesData={languagesData}
          handleNotAvailable={handleNotAvailable}
          handleClearNotAvailable={handleClearNotAvailable}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          locationError={locationError}
          setLocationError={setLocationError}
        />
      </Suspense>

      <div className={`flex w-full flex-col gap-2 p-4 lg:pr-0`}>
        {/* Options */}
        <section
          className={`sticky top-[66px] z-40 -mx-4 -mt-4 flex items-center gap-2 bg-base-100 bg-opacity-[85%] px-4 py-2 backdrop-blur lg:flex-row lg:justify-between`}
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
                  className={`btn btn-circle btn-ghost bg-secondary bg-opacity-20 hocus:btn-error md:btn-block lg:btn-sm hocus:text-white md:!h-full md:px-2 md:pr-4 lg:w-fit`}
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
              className={`btn btn-circle btn-ghost bg-secondary bg-opacity-20 md:btn-block md:px-4 lg:hidden`}
            >
              <span className="hidden md:block">Filters</span>
              <IonIcon icon={filter} className={`text-xl`} />
            </button>
            {/* </div> */}

            <div className={`hidden w-full lg:flex`}>
              <SearchSort
                handleNotAvailable={handleNotAvailable}
                handleClearNotAvailable={handleClearNotAvailable}
                inputStyles={inputStyles}
                setIsFilterActive={setIsFilterActive}
              />
            </div>
          </div>
        </section>

        {loading ? (
          <>
            {/* Loading films */}
            <section className={`mt-4 flex items-center justify-center`}>
              <button className="pointer-events-none aspect-square w-[30px] text-white">
                <span className="loading loading-spinner loading-md"></span>
              </button>
            </section>
          </>
        ) : films?.length > 0 ? (
          <>
            {/* Films list */}
            <section
              className={`grid grid-cols-3 gap-2 md:grid-cols-4 xl:grid-cols-6`}
            >
              {genresData &&
                films?.map((film) => {
                  {
                    /* 1024px */
                  }
                  const lg = `          
          lg-max:[&_>_a_#FilmPreview]:child-4n+1:left-0 lg-max:[&_>_a_#FilmPreview]:child-4n+1:translate-x-0

          lg-max:[&_>_a_#FilmPreview]:child-4n:left-auto lg-max:[&_>_a_#FilmPreview]:child-4n:translate-x-0 lg-max:[&_>_a_#FilmPreview]:child-4n:right-0
          `;

                  {
                    /* 1280px */
                  }
                  const xl = `
          xl-max:[&_>_a_#FilmPreview]:child-5n+1:left-0 xl-max:[&_>_a_#FilmPreview]:child-5n+1:translate-x-0

          xl-max:[&_>_a_#FilmPreview]:child-5n:left-auto xl-max:[&_>_a_#FilmPreview]:child-5n:translate-x-0 xl-max:[&_>_a_#FilmPreview]:child-5n:right-0
          `;

                  {
                    /* 1536px */
                  }
                  const xl2 = `
          2xl-max:[&_>_a_#FilmPreview]:child-6n+1:left-0 2xl-max:[&_>_a_#FilmPreview]:child-6n+1:translate-x-0

          2xl-max:[&_>_a_#FilmPreview]:child-6n:left-auto 2xl-max:[&_>_a_#FilmPreview]:child-6n:translate-x-0 2xl-max:[&_>_a_#FilmPreview]:child-6n:right-0
          `;

                  return (
                    <Reveal key={film.id} className={`${xl2}`}>
                      <FilmCard
                        film={film}
                        isTvPage={
                          isQueryParams ? film.media_type === "tv" : isTvPage
                        }
                      />
                    </Reveal>
                  );
                })}
            </section>
          </>
        ) : (
          <>
            {/* No film */}
            <section>
              <span>{notFoundMessage}</span>
            </section>
          </>
        )}

        {!loading && totalSearchPages > currentSearchPage && (
          <section className={`mt-4 flex items-center justify-center`}>
            <div
              ref={loadMoreBtn}
              className="pointer-events-none aspect-square w-[30px] text-white"
            >
              <span className="loading loading-spinner loading-md"></span>
            </div>
          </section>
        )}

        {notAvailable && (
          <div className="toast toast-start z-50 min-w-0 max-w-full whitespace-normal">
            <div className="alert alert-error">
              <span style={{ textWrap: `balance` }}>{notAvailable}</span>
            </div>
          </div>
        )}
      </div>
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
