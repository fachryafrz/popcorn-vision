/* eslint-disable @next/next/no-img-element */
"use client";

// React
import React, { useEffect, useRef, useState } from "react";

// Ionic
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

// Axios
import axios from "axios";

// Components
import FilmCard from "../components/FilmCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  // Movie related state
  const [films, setFilms] = useState([]);
  const [bgMovies, setBgMovies] = useState([]);

  // Search related state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState(false);
  const searchRef = useRef();
  let [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [totalSearchPages, setTotalSearchPages] = useState({});
  const [searchTips, setSearchTips] = useState(true);

  // Genre related state
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenresName, setSelectedGenresName] = useState([]);

  // Loading and UI state
  const [showButton, setShowButton] = useState(false);

  // Other dependencies and variables
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";
  const router = useRouter();

  const URLSearchQuery = useSearchParams().get("query");
  const URLSearchGenres = useSearchParams().get("genres");

  // Function to search movies
  const searchMovies = async ({ query, genres }) => {
    // setSelectedGenres

    let URL;
    let params;
    if (!genres) {
      URL = `${process.env.NEXT_PUBLIC_API_URL}/search/${
        !isTvPage ? "movie" : "tv"
      }`;
      params = {
        api_key: apiKey,
        query: searchQuery.replace(/\s+/g, "+") || query,
        sort_by: "popularity.desc",
      };
    } else {
      URL = `${process.env.NEXT_PUBLIC_API_URL}/discover/${
        !isTvPage ? "movie" : "tv"
      }`;
      params = {
        api_key: apiKey,
        with_genres: genres,
        sort_by: "popularity.desc",
      };
    }

    try {
      const response = await axios.get(URL, {
        params: params,
      });
      setFilms(response.data.results);
      setTotalSearchPages(response.data.total_pages);
    } catch (error) {
      console.log(`Errornya search:`, error);
    }
  };

  // Event listener for scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setShowButton(scrollPosition > 150);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Event handler for search query input
  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    setSearchMessage(false);
  };

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    router.replace(
      `/${!isTvPage ? "search" : "tv/search"}?query=${searchQuery.replace(
        /\s+/g,
        "+",
      )}`,
    );

    searchRef.current.blur();
    searchMovies({ query: searchQuery });
  };

  // Initial load and URL search query update
  useEffect(() => {
    setCurrentSearchPage(1);

    const query = URLSearchQuery;
    const genres = URLSearchGenres;

    if (query !== null) {
      setSearchQuery(query || "");
      searchMovies({ query: query });
    } else if (genres !== null) {
      searchMovies({ query: query, genres: genres });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [URLSearchQuery, URLSearchGenres, isTvPage]);

  // Fetch background movies
  useEffect(() => {
    const fetchBgMovies = async () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/movie/now_playing`, {
          params: {
            api_key: apiKey,
          },
        })
        .then((response) => {
          setBgMovies(response.data.results.slice(0, 3));
        });
    };

    fetchBgMovies();
  }, []);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/genre/${
            !isTvPage ? "movie" : "tv"
          }/list`,
          {
            params: {
              api_key: apiKey,
            },
          },
        )
        .then((response) => {
          setGenres(response.data.genres);
        });
    };

    fetchGenres();
  }, [isTvPage]);

  // Fetch more movies based on search or selected genres
  const fetchMoreMovies = async () => {
    setCurrentSearchPage((prevPage) => prevPage + 1);

    try {
      const selectedGenreIds = selectedGenres.join(",");

      let response;

      if (searchQuery) {
        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/search/${
            !isTvPage ? "movie" : "tv"
          }`,
          {
            params: {
              api_key: apiKey,
              query: searchQuery.replace(/\s+/g, "+"),
              sort_by: "popularity.desc",
              page: currentSearchPage,
              include_adult: false,
            },
          },
        );
      } else {
        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/discover/${
            !isTvPage ? "movie" : "tv"
          }`,
          {
            params: {
              api_key: apiKey,
              with_genres: selectedGenreIds,
              sort_by: "popularity.desc",
              page: currentSearchPage,
              include_adult: false,
            },
          },
        );
      }

      setFilms((prevMovies) => [...prevMovies, ...response.data.results]);
    } catch (error) {
      console.log(`Error fetching more movies:`, error);
    }
  };

  // Reset selected genres when switching between movie and TV pages
  const clearSelectedGenres = () => {
    setSelectedGenres([]);
    setSelectedGenresName([]);
    setFilms([]);
    setTotalSearchPages(0);
  };
  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "/") {
        setSearchTips(false);
        event.preventDefault();
        searchRef?.current.focus();
      }
    });

    clearSelectedGenres();
  }, [isTvPage]);

  // Event handler for genre selection
  const handleGenreClick = async (genreId, genre) => {
    setSearchQuery("");

    try {
      const isGenreSelected = selectedGenres.includes(genreId);
      const updatedGenres = isGenreSelected
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId];

      const updatedGenresName = isGenreSelected
        ? selectedGenresName.filter((name) => name !== genre)
        : [...selectedGenresName, genre];

      const selectedGenreIds = updatedGenres.join(",");

      // const response = await axios.get(
      //   `${process.env.NEXT_PUBLIC_API_URL}/discover/${!isTvPage ? "movie" : "tv"}`,
      //   {
      //     params: {
      //       api_key: apiKey,
      //       with_genres: selectedGenreIds,
      //       include_adult: false,
      //     },
      //   }
      // );

      router.replace(
        !isTvPage
          ? `/search?genres=${selectedGenreIds}`
          : `/tv/search?genres=${selectedGenreIds}`,
      );
      setSelectedGenres(updatedGenres);
      setSelectedGenresName(updatedGenresName);
      // setFilms(response.data.results);
      // setTotalSearchPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <Swiper
          modules={[Autoplay, EffectFade]}
          autoplay={{
            delay: 5000,
          }}
          effect="fade"
          loop={true}
          spaceBetween={0}
          slidesPerView={1}
          className={`z-0 h-[100px]`}
        >
          {bgMovies.map((movie, index) => {
            return (
              <SwiperSlide key={index}>
                <figure className="aspect-square">
                  <img
                    src={`https://image.tmdb.org/t/p/w45${movie.backdrop_path}`}
                    alt={`${!isTvPage ? movie.title : movie.name}`}
                    className={`blur-3xl`}
                    draggable={false}
                    loading="lazy"
                  />
                </figure>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={`relative z-10`}>
          <div
            className={`absolute inset-x-0 -top-8 mx-4 flex max-w-xl items-center gap-4 rounded-2xl border-x-4 border-t-4 border-base-100 bg-gray-600 bg-opacity-[90%] px-4 py-4 shadow-xl backdrop-blur before:absolute before:-left-5 before:top-3 before:h-4 before:w-4 before:rounded-br-xl before:bg-transparent before:shadow-custom-left after:absolute after:-right-5 after:top-3 after:h-4 after:w-4 after:rounded-bl-xl after:bg-transparent after:shadow-custom-right sm:mx-auto`}
          >
            <IonIcon icon={Icons.search} className={`text-[1.25rem]`} />
            <form onSubmit={handleSubmit} className={`w-full`}>
              <input
                ref={searchRef}
                onChange={handleSearchQuery}
                autoFocus={true}
                type="text"
                placeholder="Search"
                className={`w-full bg-transparent text-white`}
                value={searchQuery ? searchQuery : ``}
              />
              <input type="submit" className="sr-only" />
            </form>

            <div
              className={`pointer-events-none absolute right-4 top-[50%] hidden -translate-y-[50%] gap-1 text-xs opacity-[50%] lg:block`}
            >
              <span>Press </span>
              <kbd className={`kbd kbd-xs rounded`}>/</kbd>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl flex-col gap-2 p-4 pt-12 lg:px-[1.5rem]">
            <h2 className="text-center text-xl font-bold sm:text-3xl">
              {searchQuery ? `Results` : `Search`}{" "}
              {searchQuery && (
                <React.Fragment>
                  for <q>{searchQuery}</q>
                </React.Fragment>
              )}
            </h2>
            <div className="sticky top-[4.5rem] z-10 grid gap-2 px-2 md:grid-cols-[1fr_auto]">
              {/* Genres */}
              <Swiper
                modules={[Navigation]}
                spaceBetween={4}
                slidesPerView={"auto"}
                navigation={{
                  nextEl: "#next",
                  prevEl: "#prev",
                  clickable: true,
                }}
                className={`relative w-full rounded-xl bg-[#323946] bg-opacity-50 !p-1 backdrop-blur`}
              >
                {genres.map((item) => {
                  const activeGenre =
                    selectedGenres.includes(item.id) ||
                    URLSearchGenres?.includes(item.id);

                  return (
                    <SwiperSlide key={item.id} className="max-w-fit">
                      <button
                        onClick={() => handleGenreClick(item.id, item.name)}
                        className={`rounded-lg bg-secondary bg-opacity-30 px-4 py-2 font-medium hocus:bg-opacity-50 ${
                          activeGenre && `!bg-white !text-base-100`
                        }`}
                      >
                        {item.name}
                      </button>
                    </SwiperSlide>
                  );
                })}

                {/* Swiper Navigation */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-full justify-between">
                  <button
                    id="prev"
                    className="pointer-events-auto relative flex aspect-square h-full cursor-pointer items-center transition-all before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-100"
                  >
                    <IonIcon icon={Icons.chevronBack} />
                  </button>
                  <button
                    id="next"
                    className="pointer-events-auto relative flex aspect-square h-full cursor-pointer items-center justify-end transition-all before:absolute before:inset-0 before:bg-gradient-to-l before:from-base-100"
                  >
                    <IonIcon icon={Icons.chevronForward} />
                  </button>
                </div>
              </Swiper>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenres([]);
                    setSelectedGenresName([]);
                    setFilms([]);
                    setTotalSearchPages(0);
                    router.replace(!isTvPage ? `/search` : `/tv/search`);
                  }}
                  className={`max-w-fit items-center gap-2 rounded-xl bg-[#323946] bg-opacity-50 p-2 px-4 backdrop-blur hocus:bg-opacity-100 ${
                    selectedGenres.length > 0 || URLSearchGenres
                      ? `flex`
                      : `hidden`
                  }`}
                >
                  <IonIcon
                    icon={Icons.closeCircleOutline}
                    className={`text-[1.25rem]`}
                  />
                  Clear{" "}
                </button>
              </div>
            </div>
            <div
              className={`grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5`}
            >
              {films.map((film) => {
                const filmGenres =
                  film.genre_ids && genres
                    ? film.genre_ids.map((genreId) =>
                        genres.find((genre) => genre.id === genreId),
                      )
                    : [];

                return (
                  <SwiperSlide
                    key={film.id}
                    className="overflow-hidden transition-all"
                  >
                    <FilmCard
                      film={film}
                      genres={filmGenres}
                      isTvPage={isTvPage}
                    />
                  </SwiperSlide>
                );
              })}
              {films.length < 1 && (
                <p className="col-span-5 text-center text-gray-400">
                  {searchQuery.length > 1 &&
                    searchMessage &&
                    `Sorry, we can't find that film.`}
                </p>
              )}
            </div>
            {totalSearchPages > 1 && currentSearchPage !== totalSearchPages && (
              <div
                className={`mt-4 flex items-center before:h-[1px] before:w-full before:bg-white before:opacity-10 after:h-[1px] after:w-full after:bg-white after:opacity-10`}
              >
                {/* <button
                  onClick={() => fetchMoreMovies((currentSearchPage += 1))}
                  className="text-primary-blue p-2 px-12 xl:px-24 flex justify-center bg-white bg-opacity-5 hocus:bg-opacity-10 rounded-full whitespace-nowrap"
                >
                  Load more
                </button> */}
                <button
                  onClick={() => fetchMoreMovies((currentSearchPage += 1))}
                  className="btn btn-ghost w-[25%] min-w-fit rounded-full border-none bg-white bg-opacity-5 px-12 text-primary-blue"
                >
                  Load more
                </button>
              </div>
            )}

            <button
              onClick={scrollToTop}
              className={`pointer-events-none fixed bottom-4 right-4 flex aspect-square max-w-fit rounded-full border border-secondary bg-base-100 bg-opacity-[50%] p-4 opacity-0 backdrop-blur transition-all hocus:border-white hocus:bg-white hocus:bg-opacity-100 hocus:text-base-100 lg:right-6 2xl:right-[5.5rem] ${
                showButton && `pointer-events-auto opacity-100`
              }`}
            >
              <IonIcon icon={Icons.arrowUp} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
