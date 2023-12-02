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

export default function FilmSlider({ films, title, genres, sort = "DESC" }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const sortedFilms = [...films.results].sort((a, b) => {
    const dateA = new Date(!isTvPage ? a.release_date : a.first_air_date);
    const dateB = new Date(!isTvPage ? b.release_date : b.first_air_date);

    if (sort === "ASC") {
      return dateA - dateB;
    } else if (sort === "DESC") {
      return dateB - dateA;
    }
  });

  return (
    <section id={title}>
      <h2 className="sr-only">{title}</h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={2}
        // loop={true}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
          clickable: true,
        }}
        // breakpoints={{
        //   640: {
        //     slidesPerView: 3,
        //     slidesPerGroup: 3,
        //   },
        //   768: {
        //     slidesPerView: 4,
        //     slidesPerGroup: 4,
        //   },
        //   1024: {
        //     slidesPerView: 5,
        //     slidesPerGroup: 5,
        //   },
        // }}
        className={`!px-4 !pb-[2rem] !pt-[2.5rem] max-w-7xl relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-100 before:max-w-[8.35rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[8.35rem] after:!h-full after:bg-gradient-to-l after:from-base-100 after:z-10 before:hidden after:hidden xl:before:hidden xl:after:block before:pointer-events-none after:pointer-events-none`}
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
              className={`overflow-hidden hocus:scale-[1.025] active:scale-100 transition-all max-w-[calc(100%/2.5)] sm:max-w-[calc(100%/3.5)] md:max-w-[calc(100%/4.5)] lg:max-w-[calc(100%/5.5)] mr-2`}
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
