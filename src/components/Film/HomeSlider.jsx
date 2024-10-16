"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  EffectFade,
  Keyboard,
  FreeMode,
  Thumbs,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

// Components
import { usePathname } from "next/navigation";
import FilmSummary from "./Summary";
import Reveal from "../Layout/Reveal";
import ImagePovi from "./ImagePovi";
import moment from "moment";
import slug from "slug";

export default function HomeSlider({ films, genres, filmData }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [loading, setLoading] = useState(true);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <section id="Home Slider" className={`relative pb-4 lg:pb-8`}>
      <h2 className="sr-only">
        Highlighted {!isTvPage ? `Movies` : `TV Series`}
      </h2>
      <ul className="sr-only">
        {films.map((film, i) => {
          return (
            <li key={film.id}>
              <Link
                href={`/${!isTvPage ? `movies` : `tv`}/${film.id}-${slug(film.title ?? film.name)}`}
                prefetch={true}
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
      </ul>
      <div>
        <Swiper
          onSwiper={(swiper) => setMainSwiper(swiper)}
          onSlideChange={() => {
            if (mainSwiper) {
              setActiveSlide(mainSwiper.activeIndex);
            }
          }}
          modules={[
            Pagination,
            Autoplay,
            EffectFade,
            Keyboard,
            FreeMode,
            Thumbs,
          ]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          effect="fade"
          // loop={true} // NOTE: If this is enabled, the activeSlide will not work
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          keyboard={true}
          spaceBetween={0}
          slidesPerView={1}
          className={`relative h-[100dvh] after:absolute after:inset-y-0 after:right-0 after:z-50 after:hidden after:w-[10%] after:bg-gradient-to-l after:from-base-100 lg:h-[calc(100dvh+5rem)] 2xl:max-w-none 2xl:after:hidden`}
        >
          {films.map((film, i) => {
            const releaseDate = isItTvPage(
              film.release_date,
              film.first_air_date,
            );

            return (
              <SwiperSlide
                key={film.id}
                className={`relative flex aspect-auto items-end before:absolute before:inset-0 before:z-50 before:bg-gradient-to-r before:from-base-100 before:opacity-0 after:absolute after:inset-x-0 after:bottom-0 after:h-[75%] after:bg-gradient-to-t after:from-base-100 after:via-base-100 after:via-20% md:aspect-auto md:before:opacity-100 md:after:via-transparent md:after:via-40% lg:after:opacity-[100%]`}
              >
                <HomeFilm
                  film={film}
                  index={i}
                  activeSlide={activeSlide}
                  genres={genres}
                  isTvPage={isTvPage}
                  loading={loading}
                  setLoading={setLoading}
                  filmData={filmData}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className={`absolute bottom-20 right-0 hidden w-fit pb-8 lg:block`}>
        <Swiper
          onSwiper={setThumbsSwiper}
          watchSlidesProgress={true}
          modules={[Thumbs]}
          slidesPerView={`auto`}
          spaceBetween={0}
          wrapperClass={`items-end gap-2 justify-end p-4 !w-fit`}
        >
          {films.map((film, i) => {
            return (
              <SwiperSlide
                key={film.id}
                className={`swiper-slide-thumb aspect-video !h-fit origin-bottom cursor-pointer opacity-[60%] !transition-all hocus:opacity-[75%]`}
              >
                {/* NOTE: This is film backdrop without logo */}
                {/* <figure
                  className={`aspect-video`}
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w185${film.backdrop_path})`,
                    backgroundSize: `cover`,
                  }}
                ></figure> */}

                {/* NOTE: This is film backdrop with logo */}
                <Reveal>
                  <SliderThumbs
                    film={film}
                    index={i}
                    isTvPage={isTvPage}
                    filmData={filmData}
                  />
                </Reveal>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

function HomeFilm({
  film,
  index,
  activeSlide,
  genres,
  isTvPage,
  loading,
  setLoading,
  filmData,
}) {
  const [filmDetails, setFilmDetails] = useState();
  const [filmPoster, setFilmPoster] = useState();
  const [filmBackdrop, setFilmBackdrop] = useState();

  useEffect(() => {
    if (filmData.length > 0) {
      const matchFilm = filmData.filter((f) => f.id === film.id);

      const { images } = matchFilm[0];
      const { posters, backdrops } = images;

      setFilmDetails(matchFilm[0]);

      if (!posters.length || !posters.find((img) => img.iso_639_1 === null)) {
        setFilmPoster(film.poster_path);
      } else {
        setFilmPoster(posters.find((img) => img.iso_639_1 === null)?.file_path);
      }

      if (
        !backdrops.length ||
        !backdrops.find((img) => img.iso_639_1 === null)
      ) {
        setFilmBackdrop(film.backdrop_path);
      } else {
        setFilmBackdrop(
          backdrops.find((img) => img.iso_639_1 === null)?.file_path,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmData, film]);

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage],
  );

  return (
    <>
      <div className={`-z-10 h-full w-full`}>
        {/* Poster */}
        <Reveal y={0} className={`h-full md:hidden`}>
          <ImagePovi
            imgPath={
              filmPoster && `https://image.tmdb.org/t/p/w780${filmPoster}`
            }
            position={`top`}
            className={`h-full`}
          />
        </Reveal>

        {/* Backdrop */}
        <Reveal y={0} className={`hidden h-full md:block`}>
          <ImagePovi
            imgPath={
              filmBackdrop && `https://image.tmdb.org/t/p/w1280${filmBackdrop}`
            }
            position={`top`}
            className={`h-full`}
          />
        </Reveal>
      </div>
      <div className={`absolute bottom-0 z-50 w-full p-4 lg:bottom-20`}>
        {filmDetails && activeSlide === index && (
          <FilmSummary
            film={filmDetails}
            genres={genres}
            isTvPage={isTvPage}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </>
  );
}

// NOTE: This is for the backdrop with the film title
function SliderThumbs({ film, isTvPage, index, filmData }) {
  const [filmBackdrop, setFilmBackdrop] = useState();

  useEffect(() => {
    if (filmData.length > 0) {
      const matchFilm = filmData.filter((f) => f.id === film.id);

      const images = matchFilm[0]?.images;
      const { backdrops } = images;

      const backdropWithTitle = backdrops.find((img) => img.iso_639_1 === "en");

      if (!backdrops.length || !backdropWithTitle) {
        setFilmBackdrop(film.backdrop_path);
      } else {
        setFilmBackdrop(backdropWithTitle?.file_path);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmData, film]);

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage],
  );

  // const fetchBackdrop = useCallback(async () => {
  //   await getFilm({
  //     id: film.id,
  //     type: isItTvPage(`movie`, `tv`),
  //     path: "/images",
  //     params: {
  //       include_image_language: "en",
  //     },
  //   }).then((res) => {
  //     let { backdrops } = res;

  //     if (!backdrops.length) {
  //       setFilmBackdrop(film.backdrop_path);
  //     } else {
  //       setFilmBackdrop(backdrops[0].file_path);
  //     }
  //   });
  // }, [film.backdrop_path, film.id, isItTvPage]);

  // useEffect(() => {
  //   fetchBackdrop();
  // }, [fetchBackdrop]);

  return (
    filmBackdrop && (
      <Reveal delay={0.1 * index}>
        <figure
          className={`aspect-video rounded-lg`}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w185${filmBackdrop})`,
            backgroundSize: `cover`,
          }}
        ></figure>
      </Reveal>
    )
  );
}
