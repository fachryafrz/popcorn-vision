/* eslint-disable @next/next/no-img-element */
"use client";

import ImagePovi from "@/components/Film/ImagePovi";
import { POPCORN } from "@/lib/constants";
import { formatRating } from "@/lib/formatRating";
import { sortFilms } from "@/lib/sortFilms";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import slug from "slug";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PersonWorks({ person, movieCredits, tvCredits }) {
  const [creditsSwitcher, setCreditsSwitcher] = useState(`Movies`);
  const [films, setFilms] = useState();
  const [mediaSwiper, setMediaSwiper] = useState();

  const isTvPage = creditsSwitcher === "TV";
  const personJob = person.known_for_department;
  const personMovies =
    personJob === "Acting" ? movieCredits?.cast : movieCredits?.crew;
  const personTV = personJob === "Acting" ? tvCredits?.cast : tvCredits?.crew;

  const sortedFilms =
    films &&
    sortFilms({
      films: personJob === "Acting" ? films?.cast : films?.crew,
      isTvPage,
    });

  useEffect(() => {
    if (personMovies.length < 1) {
      setCreditsSwitcher(`TV`);
    } else if (personTV.length < 1) {
      setCreditsSwitcher(`Movies`);
    }

    if (creditsSwitcher === `TV`) {
      setFilms(tvCredits);
    } else if (creditsSwitcher === `Movies`) {
      setFilms(movieCredits);
    }
  }, [creditsSwitcher, movieCredits, personMovies, personTV, tvCredits]);

  return (
    <div>
      <section id={`Movies & TV Shows`}>
        <h2 className="sr-only">{`Movies & TV Shows`}</h2>

        <Swiper
          onSwiper={(swiper) => setMediaSwiper(swiper)}
          modules={[Navigation]}
          spaceBetween={8}
          slidesPerView={"auto"}
          // loop={true}
          navigation={{
            nextEl: ".next",
            prevEl: ".prev",
            clickable: true,
          }}
          breakpoints={{
            640: {
              // slidesPerView: 3,
              slidesPerGroup: 3,
            },
            768: {
              // slidesPerView: 4,
              slidesPerGroup: 4,
            },
            1024: {
              // slidesPerView: 5,
              slidesPerGroup: 5,
            },
          }}
          className={`relative !pb-[2rem] !pt-[2.5rem] before:pointer-events-none before:absolute before:inset-0 before:z-10 before:hidden before:max-w-[1rem] before:bg-gradient-to-r before:from-base-100 after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:hidden after:!h-full after:!w-[1rem] after:bg-gradient-to-l after:from-base-100 xl:before:hidden xl:after:hidden`}
        >
          {films &&
            sortedFilms
              .filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.id === item.id),
              )
              .map((film) => {
                return (
                  <SwiperSlide
                    key={film.id}
                    className={`max-w-[calc(100%/2.5)] overflow-hidden transition-all sm:max-w-[calc(100%/3.5)] md:max-w-[calc(100%/4.5)] lg:max-w-[calc(100%/5.5)]`}
                  >
                    <article
                      onClick={() => {
                        document.getElementById(`personModal`).close();
                      }}
                    >
                      <Link
                        href={`/${!isTvPage ? `movies` : `tv`}/${
                          film.id
                        }-${slug(film.title ?? film.name)}`}
                        prefetch={true}
                        className={`transition-all active:scale-100 hocus:scale-[1.01]`}
                      >
                        <ImagePovi
                          imgPath={film.poster_path}
                          className={`relative aspect-poster overflow-hidden rounded-lg`}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
                            role="presentation"
                            loading="lazy"
                            draggable={false}
                            alt=""
                            aria-hidden
                            width={100}
                            height={150}
                          />

                          {film.vote_average > 0 && (
                            <div
                              className={`absolute left-0 top-0 m-2 rounded-full bg-base-100 bg-opacity-50 p-1 backdrop-blur-sm`}
                            >
                              <div
                                className={`radial-progress text-sm font-semibold ${
                                  film.vote_average > 0 && film.vote_average < 3
                                    ? `text-primary-red`
                                    : film.vote_average >= 3 &&
                                        film.vote_average < 7
                                      ? `text-primary-yellow`
                                      : `text-green-500`
                                }`}
                                style={{
                                  "--value": film.vote_average * 10,
                                  "--size": "36px",
                                  "--thickness": "3px",
                                }}
                              >
                                <span className={`text-white`}>
                                  {formatRating(film.vote_average)}
                                </span>
                              </div>
                            </div>
                          )}
                        </ImagePovi>

                        <div className="mt-2">
                          <h3
                            className="text-sm font-bold sm:text-base"
                            style={{ textWrap: `balance` }}
                          >
                            {film.title ?? film.name}
                          </h3>

                          {film.character && film.character !== "Self" && (
                            <div className="mt-1 flex items-center gap-1 text-xs sm:text-sm">
                              <span className="whitespace-nowrap text-gray-400">
                                {film.character}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </article>
                  </SwiperSlide>
                );
              })}

          <div className="absolute left-0 right-0 top-0 z-20 flex h-[28px] max-w-7xl items-end justify-between px-2 xl:max-w-none">
            <div className="flex items-end gap-4">
              {personMovies.length > 0 && (
                <button
                  onClick={() => {
                    setCreditsSwitcher(`Movies`);
                    mediaSwiper.slideTo(0);
                  }}
                  className={`text-lg font-bold transition-all hocus:text-gray-500 sm:text-2xl ${
                    creditsSwitcher === `Movies`
                      ? `text-white hocus:text-white`
                      : `text-gray-600`
                  }`}
                >
                  Movies
                </button>
              )}

              {personTV.length > 0 && (
                <button
                  onClick={() => {
                    setCreditsSwitcher(`TV`);
                    mediaSwiper.slideTo(0);
                  }}
                  className={`text-lg font-bold transition-all hocus:text-gray-500 sm:text-2xl ${
                    creditsSwitcher === `TV`
                      ? `text-white hocus:text-white`
                      : `text-gray-600`
                  }`}
                >
                  TV Shows
                </button>
              )}
            </div>

            <div className={`flex items-center gap-4`}>
              <button className="prev h-[1.5rem]" aria-label="Move slider left">
                <IonIcon
                  icon={chevronBack}
                  style={{
                    fontSize: 24,
                  }}
                ></IonIcon>
              </button>
              <button
                className="next h-[1.5rem]"
                aria-label="Move slider right"
              >
                <IonIcon
                  icon={chevronForward}
                  style={{
                    fontSize: 24,
                  }}
                ></IonIcon>
              </button>
            </div>
          </div>
        </Swiper>
      </section>
    </div>
  );
}
