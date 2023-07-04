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

export default function FilmSlider({ films, title, genres }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  return (
    <>
      <h2 className="sr-only">{title}</h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={2}
        loop={true}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          1024: {
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
        }}
        className={`!px-4 !pb-[2rem] !pt-[2.5rem] xl:!px-[9rem] !pr-[3rem] relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-dark-gray before:max-w-[9rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[9rem] after:!h-full after:bg-gradient-to-l after:from-base-dark-gray after:z-10 before:hidden after:hidden xl:before:block xl:after:block before:pointer-events-none after:pointer-events-none`}
      >
        {films.results.map((film) => {
          const filmGenres =
            film.genre_ids && genres
              ? film.genre_ids.map((genreId) =>
                  genres.find((genre) => genre.id === genreId)
                )
              : [];

          return (
            <SwiperSlide
              key={film.id}
              className={`overflow-hidden hocus:scale-[1.025] active:scale-100 transition-all max-w-[50vw] sm:max-w-[33.3vw] md:max-w-[25vw] lg:max-w-[20vw]`}
            >
              <article>
                <FilmCard film={film} genres={filmGenres} isTvPage={isTvPage} />
              </article>
            </SwiperSlide>
          );
        })}

        <div className="absolute top-0 left-0 right-0 h-[28px] px-4 xl:px-[9rem] flex justify-between items-end xl:max-w-none">
          <p className="font-bold text-lg md:text-2xl">{title}</p>

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
    </>
  );
}
