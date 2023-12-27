"use client";

import React from "react";
import FilmCard from "./FilmCard";

// Swiper
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { sortFilms } from "../lib/sortFilms";

export default function FilmSlider({
  films,
  title,
  genres,
  sort = "DESC",
  viewAll = "",
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const sortedFilms = sortFilms({ films: films.results, sort, isTvPage });

  return (
    <section id={title} className={`w-full max-w-none mx-auto`}>
      <h2 className="sr-only">{title}</h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={`auto`}
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
        className={`!px-4 !pb-[2rem] !pt-[2.5rem] relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-100 before:max-w-[2rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[2rem] after:!h-full after:bg-gradient-to-l after:from-base-100 after:z-10 before:hidden after:hidden xl:before:hidden xl:after:hidden before:pointer-events-none after:pointer-events-none`}
      >
        {sortedFilms.map((film) => {
          const filmGenres =
            film.genre_ids && genres
              ? film.genre_ids.map((genreId) =>
                  genres.find((genre) => genre.id === genreId)
                )
              : [];

          return (
            <SwiperSlide
              key={film.id}
              className={`overflow-hidden transition-all max-w-[calc(100%/2.5)] sm:max-w-[calc(100%/3.5)] md:max-w-[calc(100%/4.5)] lg:max-w-[calc(100%/5.5)] xl:max-w-[calc(100%/6.5)] 2xl:max-w-[calc(100%/7.5)]`}
            >
              <article>
                <FilmCard film={film} genres={filmGenres} isTvPage={isTvPage} />
              </article>
            </SwiperSlide>
          );
        })}

        <div className="z-20 absolute top-0 left-0 right-0 h-[28px] px-4 max-w-7xl xl:max-w-none flex justify-between items-end">
          <div className="flex gap-4 items-end">
            <p className="font-bold text-lg md:text-2xl">{title}</p>

            {viewAll !== "" && (
              <Link
                href={viewAll}
                className={`text-primary-blue font-medium text-sm mb-[0.25rem]`}
              >
                View all
              </Link>
            )}
          </div>

          <div className={`flex gap-4 items-center`}>
            <button className="prev h-[1.5rem]" aria-label="Move slider left">
              <IonIcon icon={chevronBack} className="text-[1.5rem]"></IonIcon>
            </button>
            <button className="next h-[1.5rem]" aria-label="Move slider right">
              <IonIcon
                icon={chevronForward}
                className="text-[1.5rem]"
              ></IonIcon>
            </button>
          </div>
        </div>
      </Swiper>
    </section>
  );
}
