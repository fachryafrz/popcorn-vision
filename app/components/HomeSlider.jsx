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

export default function HomeSlider({ films }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };
  return (
    <section id="HomeSlider" className="pb-[2rem]">
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
        className={`h-[600px]`}
      >
        {films.results.slice(0, 5).map((film) => {
          const releaseDate = isItTvPage(
            film.release_date,
            film.first_air_date
          );
          const date = new Date(releaseDate);
          const options = { year: "numeric", month: "short" };
          const formattedDate = date.toLocaleString("en-US", options);

          return (
            <SwiperSlide
              key={film.id}
              className="flex items-end relative after:absolute after:inset-0 after:bg-gradient-to-t after:from-base-dark-gray lg:after:opacity-[100%] lg:max-h-[600px]"
            >
              <figure className="min-h-fit w-full sm:h-full -z-10 aspect-poster sm:aspect-auto">
                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                  alt={isItTvPage(film.title, film.name)}
                  className="object-top md:hidden"
                />

                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w1280${film.backdrop_path}`}
                  alt={isItTvPage(film.title, film.name)}
                  className="object-top hidden md:block"
                />
              </figure>
              <div className="flex flex-col items-center md:items-start gap-2 lg:gap-2 z-20 md:max-w-[70%] lg:max-w-[50%] absolute inset-0 p-4 xl:pl-[9rem] h-full justify-end [&_*]:z-10 text-white">
                <TitleLogo film={film} />

                <div className="flex items-center gap-2 text-sm font-bold text-white md:text-xl">
                  <div className="flex items-center gap-1 text-primary-yellow">
                    <IonIcon
                      icon={star}
                      className="!w-5 h-full aspect-square"
                    />
                    <span className="text-base md:text-xl !text-white">
                      {Math.round(film.vote_average * 10) / 10}
                    </span>
                  </div>

                  <span>&bull;</span>
                  <div className="whitespace-nowrap flex items-center gap-2">
                    <span>{date.getFullYear()}</span>
                  </div>
                </div>

                <p className="line-clamp-2 md:line-clamp-3">{film.overview}</p>

                <div className="flex gap-2 mt-4 w-full">
                  <Link
                    href={isItTvPage(`/movies/${film.id}`, `/tv/${film.id}`)}
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
                      `/movies/${film.id}#overview`,
                      `/tv/${film.id}#overview`
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
