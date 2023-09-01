/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

// Ionic React imports
import { IonIcon } from "@ionic/react";
import { star, informationCircleOutline, playOutline } from "ionicons/icons";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

// Components
import TitleLogo from "./TitleLogo";
import { usePathname } from "next/navigation";

export default function HomeSlider({ films, genres }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  function slugify(text) {
    return (
      text &&
      text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    );
  }

  return (
    <section name="Home Slider" className="pb-[2rem]">
      <h2 className="sr-only">Discover Movies</h2>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={0}
        slidesPerView={1}
        className={`lg:h-[600px]`}
      >
        {films.results.slice(0, 5).map((film) => {
          const releaseDate = isItTvPage(
            film.release_date,
            film.first_air_date
          );
          const date = new Date(releaseDate);
          const options = { year: "numeric", month: "short" };
          const formattedDate = date.toLocaleString("en-US", options);

          const filmGenres =
            film.genre_ids && genres
              ? film.genre_ids.map((genreId) =>
                  genres.find((genre) => genre.id === genreId)
                )
              : [];

          return (
            <SwiperSlide
              key={film.id}
              className="flex items-end relative before:absolute before:inset-0 before:opacity-0 md:before:opacity-100 before:bg-gradient-to-r before:from-base-dark-gray after:absolute after:inset-0 after:bottom-0 after:bg-gradient-to-t after:from-base-dark-gray after:via-base-dark-gray after:via-25% md:after:via-transparent lg:after:opacity-[100%] lg:max-h-[600px] aspect-poster sm:aspect-[4/3] md:aspect-auto"
            >
              <figure className="h-full w-full -z-10">
                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                  alt={isItTvPage(film.title, film.name)}
                  className="object-top sm:hidden"
                />

                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w1280${film.backdrop_path}`}
                  alt={isItTvPage(film.title, film.name)}
                  className="object-top hidden sm:block"
                />
              </figure>
              <div className="flex flex-col items-center md:items-start gap-2 lg:gap-2 z-20 md:max-w-[50%] lg:max-w-[50%] absolute inset-0 p-4 xl:pl-[9rem] h-full justify-end [&_*]:z-10 text-white">
                <TitleLogo film={film} />

                <div className="flex items-center justify-center flex-wrap gap-1 font-medium text-white">
                  <div className="flex items-center gap-1 text-primary-yellow">
                    <IonIcon
                      icon={star}
                      className="!w-5 h-full aspect-square"
                    />
                    <span className="!text-white">
                      {film.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span>&bull;</span>
                  <div className="whitespace-nowrap flex items-center gap-2">
                    <span>{date.getFullYear()}</span>
                  </div>
                  <span>&bull;</span>
                  {filmGenres &&
                    filmGenres.slice(0, 1).map((genre) => {
                      return <span key={genre.id}>{genre.name}</span>;
                    })}
                </div>

                <p className="hidden sm:line-clamp-1 md:line-clamp-2 lg:line-clamp-3">
                  {film.overview}
                </p>

                <div className="flex gap-2 mt-4 w-full">
                  <Link
                    href={isItTvPage(
                      `/movies/${film.id}-${slugify(film.title)}`,
                      `/tv/${film.id}-${slugify(film.name)}`
                    )}
                    className="btn bg-primary-blue bg-opacity-60"
                  >
                    <IonIcon
                      icon={informationCircleOutline}
                      className="!w-5 h-full aspect-square"
                    />
                    Details
                  </Link>
                  <Link
                    href={isItTvPage(
                      `/movies/${film.id}-${slugify(film.title)}#overview`,
                      `/tv/${film.id}-${slugify(film.name)}#overview`
                    )}
                    className="btn bg-base-gray bg-opacity-40 hocus:bg-white hocus:text-base-dark-gray"
                  >
                    <IonIcon
                      icon={playOutline}
                      className="!w-5 h-full aspect-square"
                    />
                    Trailer
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
