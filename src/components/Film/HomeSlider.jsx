"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

// Ionic React imports
import { IonIcon } from "@ionic/react";
import { star, informationCircleOutline, playOutline } from "ionicons/icons";

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
import TitleLogo from "./TitleLogo";
import { usePathname } from "next/navigation";
import axios from "axios";
import FilmSummary from "./Summary";
import { fetchData, getFilm } from "@/lib/fetch";
import Reveal from "../Layout/Reveal";
import ImagePovi from "./ImagePovi";

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
    <section name="Home Slider" className={`relative -mt-[66px] pb-[2rem]`}>
      <h2 className="sr-only">Discover Movies</h2>
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
          className={`relative h-[100svh] min-h-[500px] after:absolute after:inset-y-0 after:right-0 after:z-50 after:hidden after:w-[10%] after:bg-gradient-to-l after:from-base-100 lg:h-[calc(100svh+5rem)] 2xl:max-w-none 2xl:after:hidden`}
        >
          {films.map((film, i) => {
            const releaseDate = isItTvPage(
              film.release_date,
              film.first_air_date,
            );

            return (
              <SwiperSlide
                key={film.id}
                className={`relative flex aspect-auto items-end before:absolute before:inset-0 before:z-50 before:bg-gradient-to-r before:from-base-100 before:opacity-0 after:absolute after:inset-x-0 after:bottom-0 after:h-[75%] after:bg-gradient-to-t after:from-base-100 after:via-base-100 after:via-30% md:aspect-auto md:before:opacity-100 md:after:via-transparent md:after:via-40% lg:after:opacity-[100%]`}
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

      <div
        className={`absolute bottom-[calc(5rem+4rem-1rem)] right-0 hidden w-fit lg:block`}
      >
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

  const releaseDate = isItTvPage(film.release_date, film.first_air_date);

  // const fetchFilmDetails = useCallback(async () => {
  //   await fetchData({
  //     endpoint: `/${isItTvPage(`movie`, `tv`)}/${film.id}`,
  //     queryParams: {
  //       append_to_response: `images`,
  //     },
  //   }).then((res) => {
  //     const { images } = res;
  //     const { posters, backdrops } = images;

  //     setFilmDetails(res);

  //     if (!posters.length || !posters.find((img) => img.iso_639_1 === null)) {
  //       setFilmPoster(film.poster_path);
  //     } else {
  //       setFilmPoster(posters.find((img) => img.iso_639_1 === null)?.file_path);
  //     }

  //     if (
  //       !backdrops.length ||
  //       !backdrops.find((img) => img.iso_639_1 === null)
  //     ) {
  //       setFilmBackdrop(film.backdrop_path);
  //     } else {
  //       setFilmBackdrop(
  //         backdrops.find((img) => img.iso_639_1 === null)?.file_path,
  //       );
  //     }
  //   });
  // }, [film, isItTvPage]);

  // useEffect(() => {
  //   fetchFilmDetails();
  // }, [fetchFilmDetails]);

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
      <div
        className={`absolute inset-0 z-50 mx-auto max-h-[100svh] max-w-none p-4 pb-[2rem]`}
      >
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
