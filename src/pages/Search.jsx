import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper";
import axios from "axios";

import logo from "/popcorn.png";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import { IonIcon } from "@ionic/react";
import { search } from "ionicons/icons";
import { FilmCard } from "../components/FilmCard";
import { useHistory, useLocation } from "react-router-dom";

export default function Search({ apiUrl, query }) {
  const [movies, setMovies] = useState([]);
  const [bgMovies, setBgMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef();
  const history = useHistory();

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";

  const searchMovies = async () => {
    setLoading(true);

    axios
      .get(
        `https://api.themoviedb.org/3/search/${!isTvPage ? `movie` : `tv`}`,
        {
          params: {
            api_key: apiKey,
            query: searchQuery.replace(/\s+/g, "+"),
          },
        }
      )
      .then((response) => {
        setMovies(response.data.results);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  };

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    history.push(
      `/${!isTvPage ? `search` : `tv/search`}/${searchQuery.replace(
        /\s+/g,
        "-"
      )}`
    );

    searchRef.current.blur();
    searchMovies();
  };

  useEffect(() => {
    if (query) {
      setSearchQuery(query.replace(/\-/g, " "));
      searchMovies();
      // searchRef.current.blur();
    }
  }, [query]);

  useEffect(() => {
    document.title = `Search ${!isTvPage ? `Movies` : `TV Series`} - ${
      import.meta.env.VITE_APP_NAME
    }`;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBgMovies = async () => {
      axios
        .get(`https://api.themoviedb.org/3${apiUrl}`, {
          params: {
            api_key: apiKey,
          },
        })
        .then((response) => {
          setBgMovies(response.data.results.slice(0, 5));
        });
    };

    fetchBgMovies();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/genre/${
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
  }, [query]);

  return (
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
        className={`z-0`}
      >
        {bgMovies.map((movie, index) => {
          return (
            <SwiperSlide key={index} className={`h-[100px]`}>
              <figure className="aspect-square">
                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
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
        <div className="pt-12 p-4 lg:px-[1.5rem] mx-auto max-w-7xl flex flex-col gap-8">
          <h2 className="font-bold text-xl sm:text-3xl text-center">
            Search{" "}
            {searchQuery ? (
              <React.Fragment>
                for <q>{searchQuery}</q>
              </React.Fragment>
            ) : !isTvPage ? (
              `Movies`
            ) : (
              `TV Shows`
            )}
          </h2>
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
                  className="overflow-hidden hover:scale-[1.025] active:scale-100 transition-all"
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
          </div>
        </div>
      </div>
    </div>
  );
}