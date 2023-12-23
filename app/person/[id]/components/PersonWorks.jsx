"use client";

import { slugify } from "@/app/lib/slugify";
import { sortFilms } from "@/app/lib/sortFilms";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PersonWorks({ movieCredits, tvCredits }) {
  const [creditsSwitcher, setCreditsSwitcher] = useState(`Movies`);
  const [films, setFilms] = useState();

  const isTvPage = creditsSwitcher === `TV` ? true : false;

  const sortedFilms = films && sortFilms({ films: films?.cast, isTvPage });

  useEffect(() => {
    if (movieCredits?.cast.length < 1) {
      setCreditsSwitcher(`TV`);
    } else if (tvCredits?.cast.length < 1) {
      setCreditsSwitcher(`Movies`);
    }

    if (creditsSwitcher === `TV`) {
      setFilms(tvCredits);
    } else if (creditsSwitcher === `Movies`) {
      setFilms(movieCredits);
    }
  }, [creditsSwitcher, movieCredits, tvCredits]);

  return (
    <div>
      <section id={`Movies & TV Series`}>
        <h2 className="sr-only">{`Movies & TV Series`}</h2>

        <Swiper
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
          className={`!pb-[2rem] !pt-[2.5rem] relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-100 before:max-w-[1rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[1rem] after:!h-full after:bg-gradient-to-l after:from-base-100 after:z-10 before:hidden after:hidden xl:before:block xl:after:block before:pointer-events-none after:pointer-events-none`}
        >
          {films &&
            sortedFilms
              .filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.id === item.id)
              )
              .map((film) => {
                let popcorn = `url(/popcorn.png)`;
                let filmPoster = `url(https://image.tmdb.org/t/p/w300${film.poster_path})`;

                return (
                  <SwiperSlide
                    key={film.id}
                    className={`overflow-hidden transition-all max-w-[calc(100%/2.5)] sm:max-w-[calc(100%/3.5)] md:max-w-[calc(100%/4.5)] lg:max-w-[calc(100%/5.5)]`}
                  >
                    <article>
                      <Link
                        href={`/${
                          creditsSwitcher === `Movies` ? `movies` : `tv`
                        }/${film.id}-${slugify(
                          creditsSwitcher === `Movies` ? film.title : film.name
                        )}`}
                        className={`hocus:scale-[1.01] active:scale-100 transition-all`}
                      >
                        <figure
                          className={`rounded-lg overflow-hidden aspect-poster relative`}
                          style={{
                            backgroundImage:
                              film.poster_path === null ? popcorn : filmPoster,
                            backgroundSize:
                              film.poster_path === null ? `contain` : `cover`,
                            backgroundRepeat: `no-repeat`,
                            backgroundPosition: `center`,
                          }}
                        >
                          {film.vote_average > 0 && (
                            <div
                              className={`absolute top-0 left-0 m-2 p-1 bg-base-100 bg-opacity-50 backdrop-blur-sm rounded-full`}
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
                                  {film.vote_average < 9.9
                                    ? film.vote_average.toFixed(1)
                                    : film.vote_average}
                                </span>
                              </div>
                            </div>
                          )}
                        </figure>
                      </Link>
                    </article>
                  </SwiperSlide>
                );
              })}

          <div className="z-20 absolute top-0 left-0 right-0 h-[28px] px-2 max-w-7xl xl:max-w-none flex justify-between items-end">
            <div className="flex gap-4 items-end">
              {movieCredits?.cast.length > 0 && (
                <button
                  onClick={() => setCreditsSwitcher(`Movies`)}
                  className={`font-bold transition-all text-lg sm:text-2xl hocus:text-gray-500 ${
                    creditsSwitcher === `Movies`
                      ? `text-white hocus:text-white`
                      : `text-gray-600`
                  }`}
                >
                  Movies
                </button>
              )}

              {tvCredits?.cast.length > 0 && (
                <button
                  onClick={() => setCreditsSwitcher(`TV`)}
                  className={`font-bold transition-all text-lg sm:text-2xl hocus:text-gray-500 ${
                    creditsSwitcher === `TV`
                      ? `text-white hocus:text-white`
                      : `text-gray-600`
                  }`}
                >
                  TV Series
                </button>
              )}
            </div>

            <div className={`flex gap-4 items-center`}>
              <button className="prev h-[1.5rem]" aria-label="Move slider left">
                <IonIcon icon={chevronBack} className="text-[1.5rem]"></IonIcon>
              </button>
              <button
                className="next h-[1.5rem]"
                aria-label="Move slider right"
              >
                <IonIcon
                  icon={chevronForward}
                  className="text-[1.5rem]"
                ></IonIcon>
              </button>
            </div>
          </div>
        </Swiper>
      </section>
    </div>
  );
}
