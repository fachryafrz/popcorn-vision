import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper";
import axios from "axios";

import logo from "/popcorn.png";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import { IonIcon } from "@ionic/react";
import { search } from "ionicons/icons";
import { FilmCard } from "./FilmCard";
import { useLocation } from "react-router-dom";

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [bgMovies, setBgMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = `Search ${
      !isTvPage ? `Movies` : `TV Series`
    } - Popcorn Prespective`;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBgMovies = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/${
            !isTvPage ? `movie` : `tv`
          }/now_playing`,
          {
            params: {
              api_key: apiKey,
            },
          }
        )
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
  }, []);

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
            <SwiperSlide key={index} className={`max-h-[100px]`}>
              <figure className="aspect-square">
                <img
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
          className={`px-4 py-4 -top-8 max-w-xl sm:mx-auto absolute inset-x-0 bg-gray-600 bg-opacity-[50%] backdrop-blur-xl flex items-center gap-4 mx-4 rounded-2xl shadow-xl border-t-4 border-x-4 border-base-dark-gray before:absolute before:w-4 before:h-4 before:bg-transparent before:top-3 before:-left-5 before:rounded-br-xl before:shadow-custom-left after:absolute after:w-4 after:h-4 after:bg-transparent after:top-3 after:-right-5 after:rounded-bl-xl after:shadow-custom-right`}
        >
          <IonIcon icon={search} className={`text-[1.25rem]`} />
          <form onSubmit={handleSubmit} className={`w-full`}>
            <input
              onChange={handleSearchQuery}
              autoFocus={true}
              type="text"
              placeholder="Search"
              className={`text-white bg-transparent w-full`}
            />
            <input type="submit" className="sr-only" />
          </form>
        </div>
        <div className="pt-12 p-4 lg:px-[1.5rem] mx-auto max-w-7xl flex flex-col gap-8">
          <h2 className="font-bold text-3xl text-center">
            Search{" "}
            {searchQuery ? (
              <React.Fragment>
                for <q>{searchQuery}</q>
              </React.Fragment>
            ) : !isTvPage ? (
              `Movies`
            ) : (
              `TV Series`
            )}
          </h2>
          <div
            className={`grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
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
                  className="overflow-hidden hover:scale-105 active:scale-100 transition-all"
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
