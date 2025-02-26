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
import slug from "slug";
import moment from "moment";

export default function FilmSlider({
  films,
  title,
  sort = "DESC",
  viewAll = "",
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const sortedFilms = sortFilms({ films: films.results, sort, isTvPage });

  return (
    <section id={title} className={`mx-auto w-full max-w-none`}>
      <div className="relative z-10 flex h-[28px] max-w-7xl items-end justify-between px-4 xl:max-w-none">
        <div className="flex items-end gap-4">
          <h2 className={`text-lg font-bold md:text-2xl`}>{title}</h2>

          {viewAll !== "" && (
            <Link
              href={viewAll}
              prefetch={false}
              className={`mb-[0.25rem] text-sm font-medium text-primary-blue`}
            >
              View all
            </Link>
          )}
        </div>

        <div className={`flex items-center gap-4`}>
          <button
            className={`prev-${slug(title)} h-[1.5rem]`}
            aria-label="Move slider left"
          >
            <IonIcon
              icon={chevronBack}
              style={{
                fontSize: 24,
              }}
            ></IonIcon>
          </button>
          <button
            className={`next-${slug(title)} h-[1.5rem]`}
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

      {/* <ul className="sr-only">
        {sortedFilms.map((film) => {
          return (
            <li key={film.id}>
              <Link
                href={`/${!isTvPage ? `movies` : `tv`}/${film.id}-${slug(film.title ?? film.name)}`}
              >
                <h3>
                  {film.title ?? film.name} (
                  {moment(film.release_date ?? film.first_air_date).format(
                    "YYYY",
                  )}
                  )
                </h3>
              </Link>
              <p>{film.overview}</p>
            </li>
          );
        })}
      </ul> */}

      <Swiper
        modules={[Navigation]}
        // spaceBetween={8}
        slidesPerView={`auto`}
        // loop={true}
        navigation={{
          nextEl: `.next-${slug(title)}`,
          prevEl: `.prev-${slug(title)}`,
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
        className={`relative !px-4 !py-4 !pr-2 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:hidden before:max-w-[2rem] before:bg-gradient-to-r before:from-base-100 after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:hidden after:!h-full after:!w-[2rem] after:bg-gradient-to-l after:from-base-100 xl:before:hidden xl:after:hidden`}
        wrapperClass={`@container`}
        wrapperTag="ul"
      >
        {films.results.filter((film) => film.poster_path).map((film) => {
          return (
            <SwiperSlide
              key={film.id}
              tag="li"
              className={`max-w-[calc(100%/2.2)] pr-2 transition-all @xl:max-w-[calc(100%/3.2)] @2xl:max-w-[calc(100%/4.2)] @5xl:max-w-[calc(100%/5.2)] @6xl:max-w-[calc(100%/6)] @7xl:max-w-[calc(100%/7)]`}
            >
              <FilmCard film={film} isTvPage={isTvPage} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
