/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FilmCard from "./Card";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { usePathname } from "next/navigation";
import slug from "slug";
import moment from "moment";
import ImagePovi from "./ImagePovi";

export default function History({ title }) {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    const history = localStorage.getItem("watch-history");

    if (history) {
      const parsed = JSON.parse(history);
      const sorted = Object.values(parsed).sort(
        (a, b) => b.last_updated - a.last_updated,
      );
      setFilms(sorted);
    }
  }, []);

  return (
    <>
      {films.length > 0 && (
        <section id={title} className={`mx-auto w-full max-w-none`}>
          <div className="relative z-10 flex h-[28px] max-w-7xl items-end justify-between px-4 xl:max-w-none">
            <div className="flex items-end gap-4">
              <h2 className={`text-lg font-bold md:text-2xl`}>{title}</h2>
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

          <Swiper
            modules={[Navigation, FreeMode]}
            // spaceBetween={8}
            slidesPerView={`auto`}
            // loop={true}
            navigation={{
              nextEl: `.next-${slug(title)}`,
              prevEl: `.prev-${slug(title)}`,
              clickable: true,
            }}
            freeMode={true}
            className={`relative !px-4 !py-4 !pr-2 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:hidden before:max-w-[2rem] before:bg-gradient-to-r before:from-base-100 after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:hidden after:!h-full after:!w-[2rem] after:bg-gradient-to-l after:from-base-100 xl:before:hidden xl:after:hidden`}
            wrapperClass={`@container`}
            wrapperTag="ul"
          >
            {films?.map((film) => {
              const isTv = film.type === "tv";

              const lastChapter = isTv
                ? `s${film.last_season_watched}e${film.last_episode_watched}`
                : null;

              const duration = isTv
                ? film.show_progress[lastChapter]?.progress?.duration
                : film.progress.duration;
              const watched = isTv
                ? film.show_progress[lastChapter]?.progress?.watched
                : film.progress.watched;

              const percent = (watched / duration) * 100;

              return (
                <SwiperSlide
                  key={film.id}
                  tag="li"
                  className={`max-w-[calc(100%/1.2)] pr-2 transition-all @2xl:max-w-[calc(100%/2.2)] @5xl:max-w-[calc(100%/3.2)]`}
                >
                  <Link
                    href={`/${!isTv ? `movies` : `tv`}/${film.id}-${slug(film.title ?? film.name)}?streaming=true${isTv ? `&season=${film.last_season_watched}&episode=${film.last_episode_watched}` : ``}`}
                    prefetch={false}
                    className={`group relative block overflow-hidden rounded-xl`}
                  >
                    <ImagePovi
                      imgPath={film.backdrop_path}
                      className={`relative aspect-video overflow-hidden transition-all duration-500 group-hover:scale-110`}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w780${film.backdrop_path}`}
                        role="presentation"
                        loading="lazy"
                        draggable={false}
                        alt=""
                        aria-hidden
                        width={100}
                        height={150}
                      />
                    </ImagePovi>

                    <div
                      className={`absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-black via-black via-20% p-4`}
                    >
                      <div className={`flex flex-1 flex-col`}>
                        {/* Chapter */}
                        {isTv && (
                          <span>
                            S{film.last_season_watched} E
                            {film.last_episode_watched}
                          </span>
                        )}

                        {/* Title */}
                        <h3 className={`xs:text-xl font-bold text-pretty`}>{film.title}</h3>

                        {/* Duration */}
                        <progress
                          className={`progress mt-2 h-1 w-full`}
                          value={percent}
                          max="100"
                        ></progress>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}
    </>
  );
}
