/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Ionic React imports
import { IonIcon } from "@ionic/react";
import { star, informationCircleOutline, playOutline } from "ionicons/icons";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Keyboard } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

// Components
import TitleLogo from "./TitleLogo";
import { usePathname } from "next/navigation";
import axios from "axios";
import FilmSummary from "./FilmSummary";
import { getFilm } from "../api/route";

export default function HomeSlider({ films, genres }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const [loading, setLoading] = useState(true);

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <section name="Home Slider" className={`pb-[2rem] -mt-[66px]`}>
      <h2 className="sr-only">Discover Movies</h2>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade, Keyboard]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        keyboard={true}
        spaceBetween={0}
        slidesPerView={1}
        className={`h-[100dvh] lg:h-[120dvh] min-h-[500px] 2xl:max-w-none relative after:hidden 2xl:after:hidden after:absolute after:inset-y-0 after:w-[10%] after:right-0 after:bg-gradient-to-l after:from-base-100 after:z-50`}
      >
        {films.map((film) => {
          const releaseDate = isItTvPage(
            film.release_date,
            film.first_air_date
          );

          const filmGenres =
            film.genre_ids && genres
              ? film.genre_ids.map((genreId) =>
                  genres.find((genre) => genre.id === genreId)
                )
              : [];

          return (
            <SwiperSlide
              key={film.id}
              className={`flex items-end relative before:absolute before:inset-0 before:opacity-0 md:before:opacity-100 before:bg-gradient-to-r before:from-base-100 after:absolute after:inset-x-0 after:bottom-0 after:bg-gradient-to-t after:from-base-100 after:via-base-100 after:via-30% md:after:via-40% after:h-[75%] md:after:via-transparent lg:after:opacity-[100%] aspect-auto md:aspect-auto`}
            >
              <HomeFilm
                film={film}
                genres={genres}
                isTvPage={isTvPage}
                loading={loading}
                setLoading={setLoading}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

function HomeFilm({ film, genres, isTvPage, loading, setLoading }) {
  const [filmPoster, setFilmPoster] = useState("");
  const [filmBackdrop, setFilmBackdrop] = useState("");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  const releaseDate = isItTvPage(film.release_date, film.first_air_date);

  const filmGenres =
    film.genre_ids && genres
      ? film.genre_ids.map((genreId) =>
          genres.find((genre) => genre.id === genreId)
        )
      : [];

  useEffect(() => {
    const isItTvPage = (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    };

    getFilm({
      id: film.id,
      type: isItTvPage("movie", "tv"),
      path: "/images",
      params: {
        include_image_language: "null",
      },
    }).then((res) => {
      let { posters, backdrops } = res;

      if (!posters.length) {
        setFilmPoster(film.poster_path);
      } else {
        setFilmPoster(posters[0].file_path);
      }

      if (!backdrops.length) {
        setFilmBackdrop(film.backdrop_path);
      } else {
        setFilmBackdrop(backdrops[0].file_path);
      }
    });
  }, [film, isTvPage]);

  return (
    <>
      <figure className={`h-full w-full -z-10`}>
        {filmPoster && (
          <img
            loading={`lazy`}
            src={`https://image.tmdb.org/t/p/w500${filmPoster}`}
            alt={isItTvPage(film.title, film.name)}
            className={`object-top md:hidden`}
          />
        )}

        {filmBackdrop && (
          <img
            loading={`lazy`}
            src={`https://image.tmdb.org/t/p/w1280${filmBackdrop}`}
            alt={isItTvPage(film.title, film.name)}
            className={`object-top hidden md:block`}
          />
        )}
      </figure>
      <div className={`mx-auto max-w-none z-20 absolute inset-0 max-h-[100dvh] pb-[2rem]`}>
        <FilmSummary
          film={film}
          genres={genres}
          isTvPage={isTvPage}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </>
  );
}
