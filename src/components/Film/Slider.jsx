"use client";

import React from "react";
import FilmCard from "./Card";

// Swiper
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { sortFilms } from "../../lib/sortFilms";
import Reveal from "../Layout/Reveal";

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
    <section id={title} className={`mx-auto w-full max-w-none`}>
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
        className={`relative !px-4 !pb-[2rem] !pt-[2.5rem] before:pointer-events-none before:absolute before:inset-0 before:z-10 before:hidden before:max-w-[2rem] before:bg-gradient-to-r before:from-base-100 after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:hidden after:!h-full after:!w-[2rem] after:bg-gradient-to-l after:from-base-100 lg:!pb-[3rem] xl:before:hidden xl:after:hidden`}
      >
        {sortedFilms.map((film) => {
          {
            /* 1024px */
          }
          const lg = `          
          lg-max:[&_>_a_#FilmPreview]:child-5n+1:left-0 lg-max:[&_>_a_#FilmPreview]:child-5n+1:translate-x-0

          lg-max:[&_>_a_#FilmPreview]:child-5n:left-auto lg-max:[&_>_a_#FilmPreview]:child-5n:translate-x-0 lg-max:[&_>_a_#FilmPreview]:child-5n:right-0
          `;

          {
            /* 1280px */
          }
          const xl = `
          xl-max:[&_>_a_#FilmPreview]:child-6n+1:left-auto xl-max:[&_>_a_#FilmPreview]:child-6n+1:translate-x-0
          xl-max:[&_>_a_#FilmPreview]:child-6n:left-auto xl-max:[&_>_a_#FilmPreview]:child-6n:translate-x-0 xl-max:[&_>_a_#FilmPreview]:child-6n:right-0

          xl-max:[&_>_a_#FilmPreview]:child-18:!left-1/2 xl-max:[&_>_a_#FilmPreview]:child-18:!-translate-x-1/2
          xl-max:[&_>_a_#FilmPreview]:child-19:!left-1/2 xl-max:[&_>_a_#FilmPreview]:child-19:!-translate-x-1/2
        
          xl:[&_>_a_#FilmPreview]:last:!left-auto xl:[&_>_a_#FilmPreview]:last:!translate-x-0 xl:[&_>_a_#FilmPreview]:last:!right-0
          `;

          {
            /* 1536px */
          }
          const xl2 = `
          2xl:[&_>_a_#FilmPreview]:child-7n+1:left-auto 2xl:[&_>_a_#FilmPreview]:child-7n+1:translate-x-0
          2xl:[&_>_a_#FilmPreview]:child-7n:left-auto 2xl:[&_>_a_#FilmPreview]:child-7n:translate-x-0 2xl:[&_>_a_#FilmPreview]:child-7n:right-0

          2xl:[&_>_a_#FilmPreview]:child-14:!left-1/2 2xl:[&_>_a_#FilmPreview]:child-14:!-translate-x-1/2
          2xl:[&_>_a_#FilmPreview]:child-15:!left-1/2 2xl:[&_>_a_#FilmPreview]:child-15:!-translate-x-1/2
          `;

          return (
            <SwiperSlide
              key={film.id}
              className={`max-w-[calc(100%/2.2)] pr-2 transition-all sm:max-w-[calc(100%/3.2)] md:max-w-[calc(100%/4.2)] lg:max-w-[calc(100%/5.2)] xl:max-w-[calc(100%/6.2)] 2xl:max-w-[calc(100%/7.2)] ${xl} ${xl2}`}
            >
              {/* <Reveal> */}
              <FilmCard film={film} isTvPage={isTvPage} />
              {/* </Reveal> */}
            </SwiperSlide>
          );
        })}

        <div className="absolute left-0 right-0 top-0 flex h-[28px] max-w-7xl items-end justify-between px-4 xl:max-w-none">
          {/* <Reveal> */}
          <div className="flex items-end gap-4">
            <p className="text-lg font-bold md:text-2xl">{title}</p>

            {viewAll !== "" && (
              <Link
                href={viewAll}
                className={`mb-[0.25rem] text-sm font-medium text-primary-blue`}
              >
                View all
              </Link>
            )}
          </div>
          {/* </Reveal> */}

          {/* <Reveal> */}
          <div className={`flex items-center gap-4`}>
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