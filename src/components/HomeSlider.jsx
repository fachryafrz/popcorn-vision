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
import FilmSummary from "./FilmSummary";
import { fetchData, getFilm } from "@/lib/fetch";
import Reveal from "../lib/Reveal";
import ImagePovi from "./ImagePovi";

export default function HomeSlider({ films, genres }) {
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
    <section name="Home Slider" className={`pb-[2rem] -mt-[66px] relative`}>
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
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          keyboard={true}
          spaceBetween={0}
          slidesPerView={1}
          className={`h-[100svh] lg:h-[calc(100svh+5rem)] min-h-[500px] 2xl:max-w-none relative after:hidden 2xl:after:hidden after:absolute after:inset-y-0 after:w-[10%] after:right-0 after:bg-gradient-to-l after:from-base-100 after:z-50`}
        >
          {films.map((film, i) => {
            const releaseDate = isItTvPage(
              film.release_date,
              film.first_air_date
            );

            const filmGenres =
              film.genre_ids && genres
                ? film.genre_ids.map((genreId) =>
                    genres.find((genre) => genre.id === genreId)
                  )
                : [];

            return (
              <SwiperSlide
                key={film.id}
                className={`flex items-end relative before:z-50 before:absolute before:inset-0 before:opacity-0 md:before:opacity-100 before:bg-gradient-to-r before:from-base-100 after:absolute after:inset-x-0 after:bottom-0 after:bg-gradient-to-t after:from-base-100 after:via-base-100 after:via-30% md:after:via-40% after:h-[75%] md:after:via-transparent lg:after:opacity-[100%] aspect-auto md:aspect-auto`}
              >
                <HomeFilm
                  film={film}
                  index={i}
                  activeSlide={activeSlide}
                  genres={genres}
                  isTvPage={isTvPage}
                  loading={loading}
                  setLoading={setLoading}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div
        className={`hidden lg:block absolute right-0 bottom-[calc(5rem+4rem-1rem)] w-fit`}
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
                className={`aspect-video swiper-slide-thumb !h-fit opacity-[60%] cursor-pointer hocus:opacity-[75%] !transition-all origin-bottom`}
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
                  <SliderThumbs film={film} index={i} isTvPage={isTvPage} />
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
}) {
  const [filmDetails, setFilmDetails] = useState();
  const [filmPoster, setFilmPoster] = useState("");
  const [filmBackdrop, setFilmBackdrop] = useState("");

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage]
  );

  const releaseDate = isItTvPage(film.release_date, film.first_air_date);

  const filmGenres =
    film.genre_ids && genres
      ? film.genre_ids.map((genreId) =>
          genres.find((genre) => genre.id === genreId)
        )
      : [];

  const fetchFilmDetails = useCallback(async () => {
    await fetchData({
      endpoint: `/${isItTvPage(`movie`, `tv`)}/${film.id}`,
      queryParams: {
        append_to_response: `images`,
      },
    }).then((res) => {
      const { images } = res;
      const { posters, backdrops } = images;

      setFilmDetails(res);

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
          backdrops.find((img) => img.iso_639_1 === null)?.file_path
        );
      }
    });
  }, [film, isItTvPage]);

  useEffect(() => {
    fetchFilmDetails();
  }, [fetchFilmDetails]);

  return (
    <>
      <div className={`h-full w-full -z-10`}>
        {/* Poster */}
        <Reveal y={0} className={`md:hidden h-full`}>
          <ImagePovi
            imgPath={
              filmPoster && `https://image.tmdb.org/t/p/w780${filmPoster}`
            }
            position={`top`}
            className={`h-full`}
          />
        </Reveal>

        {/* Backdrop */}
        <Reveal y={0} className={`hidden md:block h-full`}>
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
        className={`mx-auto max-w-none z-50 absolute p-4 inset-0 max-h-[100svh] pb-[2rem]`}
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
function SliderThumbs({ film, isTvPage, index }) {
  const [filmBackdrop, setFilmBackdrop] = useState("");

  const isItTvPage = useCallback(
    (movie, tv) => {
      const type = !isTvPage ? movie : tv;
      return type;
    },
    [isTvPage]
  );

  const fetchBackdrop = useCallback(async () => {
    await getFilm({
      id: film.id,
      type: isItTvPage(`movie`, `tv`),
      path: "/images",
      params: {
        include_image_language: "en",
      },
    }).then((res) => {
      let { backdrops } = res;

      if (!backdrops.length) {
        setFilmBackdrop(film.backdrop_path);
      } else {
        setFilmBackdrop(backdrops[0].file_path);
      }
    });
  }, [film.backdrop_path, film.id, isItTvPage]);

  useEffect(() => {
    fetchBackdrop();
  }, [fetchBackdrop]);

  return (
    filmBackdrop && (
      <Reveal>
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
