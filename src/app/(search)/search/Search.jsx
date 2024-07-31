/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { fetchData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { closeCircle, filter } from "ionicons/icons";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  Suspense,
} from "react";
import Select from "react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/Layout/Navbar";
import { IsInViewport } from "@/components/Layout/IsInViewport";
import Reveal from "@/components/Layout/Reveal";
import Filters from "../../../components/Layout/Filters";
import { useInView } from "react-intersection-observer";
import { delay } from "@/lib/delay";
import FilmCard from "@/components/Film/Card";

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

  // Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Pre-loaded Options
  const searchAPIParams = useMemo(() => {
    return {
      include_adult: false,
    };
  }, []);
  const sortByTypeOptions = useMemo(
    () => [
      { value: "popularity", label: "Popularity" },
      { value: "vote_count", label: "Rating" },
      { value: "release_date", label: "Release Date" },
      { value: "revenue", label: "Revenue" },
      { value: "budget", label: "Budget" },
    ],
    [],
  );
  const sortByOrderOptions = useMemo(
    () => [
      { value: "asc", label: "Ascending" },
      { value: "desc", label: "Descending" },
    ],
    [],
  );

  // MUI Select
  const [sortByType, setSortByType] = useState({
    value: "popularity",
    label: "Popularity",
  });
  const [sortByOrder, setSortByOrder] = useState({
    value: "desc",
    label: "Descending",
  });

  // Is in viewport?
  const { ref: loadMoreBtn, inView, entry } = useInView();
  // const isLoadMoreBtnInViewport = IsInViewport({
  //   targetRef: loadMoreBtn.current,
  // });

  // Ref
  // const loadMoreBtn = useRef(ref);

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

  // Handle Select Change
  const handleSortByTypeChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.value;

      if (!value) {
        current.delete("sort_by");
      } else {
        current.set("sort_by", `${value}.${sortByOrder.value}`);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router, sortByOrder],
  );
  const handleSortByOrderChange = useCallback(
    (selectedOption) => {
      const value = selectedOption.value;

      if (!value) {
        current.delete("sort_by");
      } else {
        current.set("sort_by", `${sortByType.value}.${value}`);
      }

      const search = current.toString();

      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [current, pathname, router, sortByType],
  );

  // Handle not available
  const handleNotAvailable = () => {
    setNotAvailable(
      "Filters cannot be applied, please clear the search input.",
    );
  };

  // Fetch more films based on search or selected genres
  const fetchMoreFilms = async () => {
    try {
      let response;
      const nextPage = currentSearchPage + 1;

      if (!searchParams.get("query") && releaseDate[0] && releaseDate[1]) {
        response = await fetchData({
          endpoint: `/discover/${type}`,
          queryParams: {
            ...searchAPIParams,
            page: nextPage,
          },
        });
      }

      if (searchParams.get("query") && searchQuery) {
        response = await fetchData({
          endpoint: `/search/${type}`,
          queryParams: {
            query: searchQuery,
            language: "en-US",
            page: nextPage,
          },
        });
      }

      const isDuplicate = (film) =>
        films.some((prevFilm) => prevFilm.id === film.id);

      const filteredFilms = response.results.filter(
        (film) => !isDuplicate(film),
      );

      setLoading(false);
      setFilms((prevMovies) => [...prevMovies, ...filteredFilms]);
      setTotalSearchResults(response.total_results);
      setTotalSearchPages(response.total_pages);
      setCurrentSearchPage(response.page);

      setTimeout(() => {
        setNotFoundMessage("No film found");
      }, 10000);

      setCurrentSearchPage(nextPage);
    } catch (error) {
      console.log(`Error fetching more films:`, error);
    }
  };

  // Use Effect for load more button is in viewport
  // useEffect(() => {
  //   if (isLoadMoreBtnInViewport) {
  //     loadMoreBtn.current.click();
  //   }
  // }, [isLoadMoreBtnInViewport]);

  useEffect(() => {
    if (inView) {
      fetchMoreFilms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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
          setNotAvailable={setNotAvailable}
          sortByOrderOptions={sortByOrderOptions}
          sortByTypeOptions={sortByTypeOptions}
          setLoading={setLoading}
          setFilms={setFilms}
          genresData={genresData}
          // setGenresData={setGenresData}
          setTotalSearchPages={setTotalSearchPages}
          setCurrentSearchPage={setCurrentSearchPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setNotFoundMessage={setNotFoundMessage}
          sortByType={sortByType}
          setSortByType={setSortByType}
          sortByOrder={sortByOrder}
          setSortByOrder={setSortByOrder}
          isFilterActive={isFilterActive}
          setIsFilterActive={setIsFilterActive}
          releaseDate={releaseDate}
          setReleaseDate={setReleaseDate}
          minYear={minYear}
          // setMinYear={setMinYear}
          maxYear={maxYear}
          // setMaxYear={setMaxYear}
          searchAPIParams={searchAPIParams}
          languagesData={languagesData}
          totalSearchResults={totalSearchResults}
          setTotalSearchResults={setTotalSearchResults}
        />
      </Suspense>

      <div className={`flex w-full flex-col gap-2 p-4 lg:pr-0`}>
        {/* Options */}
        <section
          className={`flex flex-col items-center gap-4 lg:flex-row lg:justify-between`}
        >
          {/* Search bar */}
          <div className={`w-full lg:hidden`}>
            <SearchBar placeholder={`Tap to search`} />
          </div>

          <div className={`lg:w-full`}>
            <h1 className={`text-2xl font-bold capitalize`}>Search</h1>
          </div>

          <div
            className={`flex w-full flex-col items-center justify-between gap-2 sm:flex-row lg:justify-end`}
          >
            <div
              onMouseOver={() => isQueryParams && handleNotAvailable()}
              onMouseLeave={() => setNotAvailable("")}
              className={`flex flex-wrap justify-center gap-1 sm:flex-nowrap`}
            >
              {/* Sort by type */}
              <Select
                options={sortByTypeOptions}
                onChange={handleSortByTypeChange}
                value={sortByType}
                styles={{
                  ...inputStyles,
                  dropdownIndicator: (styles) => ({
                    ...styles,
                    display: "block",
                    "&:hover": {
                      color: "#fff",
                    },
                    cursor: "pointer",
                  }),
                  control: (styles) => ({
                    ...styles,
                    color: "#fff",
                    backgroundColor: "#131720",
                    borderWidth: "1px",
                    borderColor: "#79808B",
                    borderRadius: "1.5rem",
                    cursor: "pointer",
                  }),
                }}
                isDisabled={isQueryParams}
                isSearchable={false}
                className={`w-[145px]`}
              />

              {/* Sort by order */}
              <Select
                options={sortByOrderOptions}
                onChange={handleSortByOrderChange}
                value={sortByOrder}
                styles={{
                  ...inputStyles,
                  dropdownIndicator: (styles) => ({
                    ...styles,
                    display: "block",
                    "&:hover": {
                      color: "#fff",
                    },
                    cursor: "pointer",
                  }),
                  control: (styles) => ({
                    ...styles,
                    color: "#fff",
                    backgroundColor: "#131720",
                    borderWidth: "1px",
                    borderColor: "#79808B",
                    borderRadius: "1.5rem",
                    cursor: "pointer",
                  }),
                }}
                isDisabled={isQueryParams}
                isSearchable={false}
                className={`w-[145px]`}
              />
            </div>

            <div className={`flex flex-wrap items-center gap-1 sm:flex-nowrap`}>
              {/* Clear all filters */}
              <Suspense>
                <div
                  className={`mr-1 flex flex-row-reverse flex-wrap items-center gap-2`}
                >
                  {searchParams.get("status") ||
                  searchParams.get("type") ||
                  searchParams.get("release_date") ||
                  searchParams.get("with_genres") ||
                  searchParams.get("with_original_language") ||
                  searchParams.get("watch_providers") ||
                  searchParams.get("with_networks") ||
                  searchParams.get("with_cast") ||
                  searchParams.get("with_crew") ||
                  searchParams.get("with_keywords") ||
                  searchParams.get("with_companies") ||
                  searchParams.get("vote_count") ||
                  searchParams.get("with_runtime") ||
                  searchParams.get("o") ||
                  searchParams.get("sort_by") ? (
                    <button
                      onClick={() => {
                        setTimeout(() => {
                          //   setSearchQuery("");
                          //   setStatus([]);
                          //   setTvType([]);
                          //   setReleaseDate([minYear, maxYear]);
                          //   setReleaseDateSlider([minYear, maxYear]);
                          //   setGenre(null);
                          //   setLanguage(null);
                          //   setCast(null);
                          //   setCrew(null);
                          //   setKeyword(null);
                          //   setCompany(null);
                          //   setRating([0, 100]);
                          //   setRatingSlider([0, 100]);
                          //   setRuntime([0, 300]);
                          //   setRuntimeSlider([0, 300]);
                          setSortByType(sortByTypeOptions[0]);
                          setSortByOrder(sortByOrderOptions[1]);
                        }, 1000);

                        router.push(`${pathname}`);
                        // router.refresh();
                        // defaultFilms();
                      }}
                      className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-2 pr-4 text-gray-400 transition-all hocus:bg-red-600 hocus:text-white`}
                    >
                      <IonIcon icon={closeCircle} className={`text-xl`} />
                      <span className={`whitespace-nowrap text-sm`}>
                        Clear all filters
                      </span>
                    </button>
                  ) : (
                    <span>No filter selected</span>
                  )}
                </div>
              </Suspense>

              {/* Filter button */}
              <button
                onClick={() =>
                  isQueryParams ? handleNotAvailable() : setIsFilterActive(true)
                }
                onMouseLeave={() => setNotAvailable("")}
                className={`btn btn-ghost aspect-square bg-secondary bg-opacity-20 lg:hidden`}
              >
                <IonIcon icon={filter} className={`text-2xl`} />
              </button>
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
            <button
              ref={loadMoreBtn}
              onClick={fetchMoreFilms}
              className="pointer-events-none aspect-square w-[30px] text-white"
            >
              <span className="loading loading-spinner loading-md"></span>
            </button>
          </section>
        )}

        {notAvailable && (
          <div className="toast toast-start z-40 min-w-0 max-w-full whitespace-normal">
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
