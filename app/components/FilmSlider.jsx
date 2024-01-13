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
import Reveal from "../lib/Reveal";

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
        // spaceBetween={8}
        slidesPerView={`auto`}
        // loop={true}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerGroup: 3,
          },
          768: {
            slidesPerGroup: 4,
          },
          1024: {
            slidesPerGroup: 5,
          },
          1280: {
            slidesPerGroup: 6,
          },
          1536: {
            slidesPerGroup: 7,
          },
        }}
        className={`!px-4 !pb-[2rem] lg:!pb-[3rem] !pt-[2.5rem] relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-100 before:max-w-[2rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[2rem] after:!h-full after:bg-gradient-to-l after:from-base-100 after:z-10 before:hidden after:hidden xl:before:hidden xl:after:hidden before:pointer-events-none after:pointer-events-none`}
      >
        {sortedFilms.map((film) => {
          const filmGenres =
            film.genre_ids && genres
              ? film.genre_ids.map((genreId) =>
                  genres.find((genre) => genre.id === genreId)
                )
              : [];

          const first = `[&_>_a_#FilmPreview]:first:!left-0 [&_>_a_#FilmPreview]:first:!translate-x-0`;
          const last = `[&_>_a_#FilmPreview]:last:!left-auto [&_>_a_#FilmPreview]:last:!translate-x-0 [&_>_a_#FilmPreview]:last:!right-0`;
          const fifth = `lg:[&_>_a_#FilmPreview]:fifth:!left-auto lg:[&_>_a_#FilmPreview]:fifth:!translate-x-0 lg:[&_>_a_#FilmPreview]:fifth:!right-0 xl:[&_>_a_#FilmPreview]:fifth:!left-1/2 xl:[&_>_a_#FilmPreview]:fifth:!-translate-x-1/2`;
          const sixth = `lg:[&_>_a_#FilmPreview]:sixth:!left-0 lg:[&_>_a_#FilmPreview]:sixth:!translate-x-0 xl:[&_>_a_#FilmPreview]:sixth:!left-auto xl:[&_>_a_#FilmPreview]:sixth:!translate-x-0 xl:[&_>_a_#FilmPreview]:sixth:!right-0 2xl:[&_>_a_#FilmPreview]:sixth:!left-1/2 2xl:[&_>_a_#FilmPreview]:sixth:!-translate-x-1/2`;
          const seventh = `xl:[&_>_a_#FilmPreview]:seventh:!left-0 xl:[&_>_a_#FilmPreview]:seventh:!translate-x-0
          2xl:[&_>_a_#FilmPreview]:seventh:!left-auto 2xl:[&_>_a_#FilmPreview]:seventh:!translate-x-0 2xl:[&_>_a_#FilmPreview]:seventh:!right-0`;
          const eighth = `2xl:[&_>_a_#FilmPreview]:eighth:!left-0 2xl:[&_>_a_#FilmPreview]:eighth:!translate-x-0`;

          return (
            <SwiperSlide
              key={film.id}
              className={`transition-all pr-2 max-w-[calc(100%/2.1)] sm:max-w-[calc(100%/3.1)] md:max-w-[calc(100%/4.1)] lg:max-w-[calc(100%/5.1)] xl:max-w-[calc(100%/6.1)] 2xl:max-w-[calc(100%/7.1)] ${first} ${last} ${fifth} ${sixth} ${seventh} ${eighth}`}
            >
              {/* <Reveal> */}
              <FilmCard
                film={film}
                genres={filmGenres}
                isTvPage={isTvPage}
                enablePreview={true}
              />
              {/* </Reveal> */}
            </SwiperSlide>
          );
        })}

        <div className="absolute top-0 left-0 right-0 h-[28px] px-4 max-w-7xl xl:max-w-none flex justify-between items-end">
          {/* <Reveal> */}
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
          {/* </Reveal> */}

          {/* <Reveal> */}
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
          {/* </Reveal> */}
        </div>
      </Swiper>
    </section>
  );
}
