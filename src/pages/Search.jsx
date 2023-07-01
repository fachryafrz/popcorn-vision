import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper";
import axios from "axios";
import { Helmet } from "react-helmet";

import logo from "/popcorn.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import { search } from "ionicons/icons";
import { FilmCard } from "../components/FilmCard";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Loading } from "../components/Loading";

export default function Search({ apiUrl, query }) {
  const [movies, setMovies] = useState([]);
  const [bgMovies, setBgMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMessage, setSearchMessage] = useState(false);
  const searchRef = useRef();
  const history = useHistory();
  let [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [totalSearchPages, setTotalSearchPages] = useState({});

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const URLSearchQuery = new URLSearchParams(location.search).get("query");
  const [showButton, setShowButton] = useState(false);
  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";

  const searchMovies = async (query) => {
    setLoading(true);
    setSelectedGenres([]);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/search/${
          !isTvPage ? `movie` : `tv`
        }`,
        {
          params: {
            api_key: apiKey,
            query: searchQuery.replace(/\s+/g, "+") || query,
            sort_by: "popularity.desc",
          },
        }
      );
      setMovies(response.data.results);
      setTotalSearchPages(response.data.total_pages);
    } catch (error) {
      console.log(`Errornya search:`, error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  };

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    setSearchMessage(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    history.push(
      `/${!isTvPage ? `search` : `tv/search`}?query=${searchQuery.replace(
        /\s+/g,
        "+"
      )}`
    );

    setSearchMessage(true);
    searchRef.current.blur();
    searchMovies();
  };

  useEffect(() => {
    setCurrentSearchPage(1);

    const query = URLSearchQuery;
    setSearchQuery(query || "");
    searchMovies(query);
  }, [location.search, isTvPage]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBgMovies = async () => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}${apiUrl}`, {
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

  useEffect(() => {
    const fetchGenres = async () => {
      axios
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/genre/${
            !isTvPage ? `movie` : `tv`
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
  }, [query, isTvPage]);

  const fetchMoreMovies = async () => {
    setCurrentSearchPage((prevPage) => prevPage + 1);

    try {
      const selectedGenreIds = selectedGenres.join(",");

      let response;

      if (searchQuery) {
        response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/search/${
            !isTvPage ? `movie` : `tv`
          }`,
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
          `${import.meta.env.VITE_API_BASE_URL}/discover/${
            !isTvPage ? `movie` : `tv`
          }`,
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

      setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
    } catch (error) {
      console.log(`Error fetching more movies:`, error);
    }
  };

  useEffect(() => {
    setSelectedGenres([]);
  }, [isTvPage]);

  const handleGenreClick = async (genreId) => {
    setLoading(true);

    history.push(`/${!isTvPage ? "search" : "tv/search"}`);

    try {
      const updatedGenres = selectedGenres.includes(genreId)
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId];

      const selectedGenreIds = updatedGenres.join(",");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/discover/${
          !isTvPage ? "movie" : "tv"
        }?api_key=${apiKey}&with_genres=${selectedGenreIds}`
      );

      setSelectedGenres(updatedGenres);
      setMovies(response.data.results);
      setTotalSearchPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  };

  // console.log(
  //   `${import.meta.env.VITE_API_BASE_URL}/discover/${
  //     !isTvPage ? `movie` : `tv`
  //   }?api_key=${apiKey}&with_genres=${selectedGenres.join(",")}`
  // );

  return (
    <>
      <Helmet>
        <meta name="robots" content="index, archive" />
        <meta name="description" content={import.meta.env.VITE_APP_DESC} />
        <meta name="keywords" content={import.meta.env.VITE_APP_KEYWORDS} />
        <link rel="canonical" href={import.meta.env.VITE_APP_URL} />

        {URLSearchQuery ? (
          <title>{`${searchQuery} - ${import.meta.env.VITE_APP_NAME} ${
            !isTvPage ? `` : `(TV)`
          }`}</title>
        ) : (
          <title>{`Search ${!isTvPage ? `Movies` : `TV Series`} - ${
            import.meta.env.VITE_APP_NAME
          } ${!isTvPage ? `` : `(TV)`}`}</title>
        )}

        <meta property="og:site_name" content={import.meta.env.VITE_APP_NAME} />
        <meta
          property="og:title"
          content={`Search ${!isTvPage ? `Movies` : `TV Series`} - ${
            import.meta.env.VITE_APP_NAME
          }`}
        />
        <meta
          property="og:description"
          content={import.meta.env.VITE_APP_DESC}
        />
        <meta
          property="og:image"
          content={`${import.meta.env.VITE_APP_URL}/popcorn.png`}
        />
        <meta property="og:url" content={import.meta.env.VITE_APP_URL} />
        <meta property="og:type" content="website" />
      </Helmet>

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
                    src={`${import.meta.env.VITE_API_IMAGE_URL_500}${
                      movie.backdrop_path
                    }`}
                    alt={`${!isTvPage ? movie.title : movie.name}`}
                    className={`blur-3xl`}
                  />
                </figure>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={`relative`}>
          <div
            className={`px-4 py-4 -top-8 max-w-xl sm:mx-auto absolute inset-x-0 bg-gray-600 bg-opacity-[90%] backdrop-blur flex items-center gap-4 mx-4 rounded-2xl shadow-xl border-t-4 border-x-4 border-base-dark-gray before:absolute before:w-4 before:h-4 before:bg-transparent before:top-3 before:-left-5 before:rounded-br-xl before:shadow-custom-left after:absolute after:w-4 after:h-4 after:bg-transparent after:top-3 after:-right-5 after:rounded-bl-xl after:shadow-custom-right`}
          >
            <IonIcon icon={search} className={`text-[1.25rem]`} />
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
          </div>
          <div className="pt-12 p-4 lg:px-[1.5rem] mx-auto max-w-7xl flex flex-col gap-4">
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
                className={`w-full p-1 rounded-xl bg-[#323946] bg-opacity-50 backdrop-blur relative`}
              >
                {genres.map((item) => {
                  const activeGenre = selectedGenres.includes(item.id);

                  return (
                    <SwiperSlide key={item.id} className="w-fit">
                      <button
                        onClick={() => handleGenreClick(item.id)}
                        className={`font-medium py-2 px-4 rounded-lg bg-base-gray bg-opacity-30 hocus:bg-opacity-50 ${
                          activeGenre && `!bg-white !text-base-dark-gray`
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
                    className="aspect-square h-full flex items-center relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-dark-gray pointer-events-auto cursor-pointer transition-all"
                  >
                    <IonIcon icon={Icons.chevronBack} />
                  </button>
                  <button
                    id="next"
                    className="aspect-square h-full flex items-center justify-end relative before:absolute before:inset-0 before:bg-gradient-to-l before:from-base-dark-gray pointer-events-auto cursor-pointer transition-all"
                  >
                    <IonIcon icon={Icons.chevronForward} />
                  </button>
                </div>
              </Swiper>

              {/* Film type switcher */}
              <div className="flex justify-center">
                <div className="flex place-content-center w-fit gap-1 p-1 rounded-xl bg-[#323946] bg-opacity-50 backdrop-blur">
                  <Link
                    to={
                      URLSearchQuery
                        ? `/search?query=${URLSearchQuery.replace(/\s+/g, "+")}`
                        : `/search`
                    }
                    className={`font-medium py-2 px-4 rounded-lg hocus:bg-base-gray hocus:bg-opacity-20 ${
                      !isTvPage &&
                      `bg-white text-base-dark-gray hocus:!bg-white hocus:!bg-opacity-100`
                    }`}
                  >
                    Movies
                  </Link>
                  <Link
                    to={
                      URLSearchQuery
                        ? `/tv/search?query=${URLSearchQuery.replace(
                            /\s+/g,
                            "+"
                          )}`
                        : `/tv/search`
                    }
                    className={`font-medium py-2 px-4 rounded-lg hocus:bg-base-gray hocus:bg-opacity-20 ${
                      isTvPage &&
                      `bg-white text-base-dark-gray hocus:!bg-white hocus:!bg-opacity-100`
                    }`}
                  >
                    TV Series
                  </Link>
                </div>
              </div>

              {/* Sort By */}
              <div className="hidden"></div>
            </div>
            <div
              className={`grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5`}
            >
              {movies.map((movie, index) => {
                const movieGenres =
                  movie.genre_ids && genres
                    ? movie.genre_ids.map((genreId) =>
                        genres.find((genre) => genre.id === genreId)
                      )
                    : [];

                return (
                  <SwiperSlide
                    key={index}
                    className="overflow-hidden hocus:scale-[1.025] active:scale-100 transition-all"
                  >
                    <FilmCard
                      movie={movie}
                      logo={logo}
                      movieGenres={movieGenres}
                      isTvPage={isTvPage}
                      loading={loading}
                    />
                  </SwiperSlide>
                );
              })}
              {movies.length < 1 && (
                <p className="text-gray-400 text-center col-span-5">
                  {searchQuery.length > 1 &&
                    searchMessage &&
                    !loading &&
                    `Sorry, we can't find that film.`}
                </p>
              )}
            </div>
            {totalSearchPages > 1 && currentSearchPage !== totalSearchPages && (
              <button
                onClick={() => fetchMoreMovies((currentSearchPage += 1))}
                className="text-primary-blue py-2 flex justify-center hocus:bg-white hocus:bg-opacity-10 rounded-lg"
              >
                Load more movies
              </button>
            )}

            <button
              onClick={scrollToTop}
              className={`fixed bottom-4 right-4 lg:right-6 2xl:right-[5.5rem] flex max-w-fit aspect-square p-4 rounded-full bg-base-dark-gray bg-opacity-[50%] backdrop-blur border border-base-gray hocus:bg-white hocus:bg-opacity-100 hocus:text-base-dark-gray hocus:border-white transition-all opacity-0 pointer-events-none ${
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
