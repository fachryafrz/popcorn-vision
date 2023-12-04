/* eslint-disable @next/next/no-img-element */
"use client";

// React
import React, { useEffect, useRef, useState } from "react";

// Ionic
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper";
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
      URL = `https://api.themoviedb.org/3/search/${!isTvPage ? "movie" : "tv"}`;
      params = {
        api_key: apiKey,
        query: searchQuery.replace(/\s+/g, "+") || query,
        sort_by: "popularity.desc",
      };
    } else {
      URL = `https://api.themoviedb.org/3/discover/${
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
        "+"
      )}`
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
  }, [URLSearchQuery, URLSearchGenres, isTvPage]);

  // Fetch background movies
  useEffect(() => {
    const fetchBgMovies = async () => {
      axios
        .get(`https://api.themoviedb.org/3/movie/now_playing`, {
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
          `https://api.themoviedb.org/3/genre/${
            !isTvPage ? "movie" : "tv"
          }/list`,
          {
            params: {
              api_key: apiKey,
            },
          }
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
          `https://api.themoviedb.org/3/search/${!isTvPage ? "movie" : "tv"}`,
          {
            params: {
              api_key: apiKey,
              query: searchQuery.replace(/\s+/g, "+"),
              sort_by: "popularity.desc",
              page: currentSearchPage,
              include_adult: false,
            },
          }
        );
      } else {
        response = await axios.get(
          `https://api.themoviedb.org/3/discover/${!isTvPage ? "movie" : "tv"}`,
          {
            params: {
              api_key: apiKey,
              with_genres: selectedGenreIds,
              sort_by: "popularity.desc",
              page: currentSearchPage,
              include_adult: false,
            },
          }
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
      //   `https://api.themoviedb.org/3/discover/${!isTvPage ? "movie" : "tv"}`,
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
          : `/tv/search?genres=${selectedGenreIds}`
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
                    loading="lazy"
                    src={`https://image.tmdb.org/t/p/w45${movie.backdrop_path}`}
                    alt={`${!isTvPage ? movie.title : movie.name}`}
                    className={`blur-3xl`}
                  />
                </figure>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={`relative z-10`}>
          <div
            className={`px-4 py-4 -top-8 max-w-xl sm:mx-auto absolute inset-x-0 bg-gray-600 bg-opacity-[90%] backdrop-blur flex items-center gap-4 mx-4 rounded-2xl shadow-xl border-t-4 border-x-4 border-base-100 before:absolute before:w-4 before:h-4 before:bg-transparent before:top-3 before:-left-5 before:rounded-br-xl before:shadow-custom-left after:absolute after:w-4 after:h-4 after:bg-transparent after:top-3 after:-right-5 after:rounded-bl-xl after:shadow-custom-right`}
          >
            <IonIcon icon={Icons.search} className={`text-[1.25rem]`} />
            <form onSubmit={handleSubmit} className={`w-full`}>
              <input
                ref={searchRef}
                onChange={handleSearchQuery}
                autoFocus={true}
                type="text"
                placeholder="Search"
                className={`text-white bg-transparent w-full`}
                value={searchQuery ? searchQuery : ``}
              />
              <input type="submit" className="sr-only" />
            </form>

            <div
              className={`hidden lg:block text-xs absolute right-4 top-[50%] -translate-y-[50%] gap-1 opacity-[50%] pointer-events-none`}
            >
              <span>Press </span>
              <kbd className={`kbd kbd-xs rounded`}>/</kbd>
            </div>
          </div>
          <div className="pt-12 p-4 lg:px-[1.5rem] mx-auto max-w-7xl flex flex-col gap-2">
            <h2 className="font-bold text-xl sm:text-3xl text-center">
              {searchQuery ? `Results` : `Search`}{" "}
              {searchQuery && (
                <React.Fragment>
                  for <q>{searchQuery}</q>
                </React.Fragment>
              )}
            </h2>
            <div className="grid md:grid-cols-[1fr_auto] gap-2 sticky top-[4.5rem] z-10 px-2">
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
                className={`w-full !p-1 rounded-xl bg-[#323946] bg-opacity-50 backdrop-blur relative`}
              >
                {genres.map((item) => {
                  const activeGenre =
                    selectedGenres.includes(item.id) ||
                    URLSearchGenres?.includes(item.id);

                  return (
                    <SwiperSlide key={item.id} className="max-w-fit">
                      <button
                        onClick={() => handleGenreClick(item.id, item.name)}
                        className={`font-medium py-2 px-4 rounded-lg bg-secondary bg-opacity-30 hocus:bg-opacity-50 ${
                          activeGenre && `!bg-white !text-base-100`
                        }`}
                      >
                        {item.name}
                      </button>
                    </SwiperSlide>
                  );
                })}

                {/* Swiper Navigation */}
                <div className="absolute inset-x-0 top-0 h-full z-20 flex justify-between pointer-events-none">
                  <button
                    id="prev"
                    className="aspect-square h-full flex items-center relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-100 pointer-events-auto cursor-pointer transition-all"
                  >
                    <IonIcon icon={Icons.chevronBack} />
                  </button>
                  <button
                    id="next"
                    className="aspect-square h-full flex items-center justify-end relative before:absolute before:inset-0 before:bg-gradient-to-l before:from-base-100 pointer-events-auto cursor-pointer transition-all"
                  >
                    <IonIcon icon={Icons.chevronForward} />
                  </button>
                </div>
              </Swiper>
              <div className="flex justify-end items-center">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenres([]);
                    setSelectedGenresName([]);
                    setFilms([]);
                    setTotalSearchPages(0);
                    router.replace(!isTvPage ? `/search` : `/tv/search`);
                  }}
                  className={`max-w-fit items-center gap-2 bg-[#323946] bg-opacity-50 backdrop-blur p-2 px-4 rounded-xl hocus:bg-opacity-100 ${
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
              className={`grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5`}
            >
              {films.map((film) => {
                const filmGenres =
                  film.genre_ids && genres
                    ? film.genre_ids.map((genreId) =>
                        genres.find((genre) => genre.id === genreId)
                      )
                    : [];

                return (
                  <SwiperSlide
                    key={film.id}
                    className="overflow-hidden hocus:scale-[1.025] active:scale-100 transition-all"
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
                <p className="text-gray-400 text-center col-span-5">
                  {searchQuery.length > 1 &&
                    searchMessage &&
                    `Sorry, we can't find that film.`}
                </p>
              )}
            </div>
            {totalSearchPages > 1 && currentSearchPage !== totalSearchPages && (
              <div
                className={`flex items-center before:h-[1px] before:w-full before:bg-white before:opacity-10 after:h-[1px] after:w-full after:bg-white after:opacity-10 mt-4`}
              >
                {/* <button
                  onClick={() => fetchMoreMovies((currentSearchPage += 1))}
                  className="text-primary-blue p-2 px-12 xl:px-24 flex justify-center bg-white bg-opacity-5 hocus:bg-opacity-10 rounded-full whitespace-nowrap"
                >
                  Load more
                </button> */}
                <button
                  onClick={() => fetchMoreMovies((currentSearchPage += 1))}
                  className="btn btn-ghost bg-white text-primary-blue rounded-full px-12 min-w-fit w-[25%] bg-opacity-5 border-none"
                >
                  Load more
                </button>
              </div>
            )}

            <button
              onClick={scrollToTop}
              className={`fixed bottom-4 right-4 lg:right-6 2xl:right-[5.5rem] flex max-w-fit aspect-square p-4 rounded-full bg-base-100 bg-opacity-[50%] backdrop-blur border border-secondary hocus:bg-white hocus:bg-opacity-100 hocus:text-base-100 hocus:border-white transition-all opacity-0 pointer-events-none ${
                showButton && `opacity-100 pointer-events-auto`
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
