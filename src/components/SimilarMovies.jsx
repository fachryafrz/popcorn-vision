import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { FilmCard } from "./FilmCard";

export function SimilarMovies({ logo, movie, genres, isTvPage }) {
  return (
    <div id="Similar Movies">
      <h2 className="sr-only">Recommendations</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="px-4 py-[3rem] xl:px-[8rem] pr-12 xl:pr-[8rem] relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-dark-gray before:max-w-[9rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[9rem] after:!h-full after:bg-gradient-to-l after:from-base-dark-gray after:z-10 before:hidden after:hidden xl:before:block xl:after:block before:pointer-events-none after:pointer-events-none"
      >
        {movie.recommendations &&
          movie.recommendations.results &&
          movie.recommendations.results.map((movie, index) => {
            const movieGenres =
              movie.genre_ids && genres
                ? movie.genre_ids.map((genreId) =>
                    genres.find((genre) => genre.id === genreId)
                  )
                : [];

            return (
              <SwiperSlide
                key={index}
                className="overflow-hidden hover:scale-105 active:scale-100 transition-all"
              >
                <FilmCard
                  movie={movie}
                  logo={logo}
                  movieGenres={movieGenres}
                  isTvPage={isTvPage}
                />
              </SwiperSlide>
            );
          })}

        <div className="absolute top-2 md:top-0 left-0 right-0 h-8 px-4 lg:px-[8rem] flex justify-between items-center xl:max-w-none">
          <p className="font-bold text-xl lg:text-2xl">
            {movie.recommendations && movie.recommendations.results.length !== 0
              ? `Recommendations`
              : ``}
          </p>
          <div className="flex gap-4 items-center">
            <button className="prev h-[1.5rem]">
              {movie.recommendations &&
              movie.recommendations.results.length !== 0 ? (
                <IonIcon icon={chevronBack} className="text-[1.5rem]"></IonIcon>
              ) : (
                ``
              )}
            </button>
            <button className="next h-[1.5rem]">
              {movie.recommendations &&
              movie.recommendations.results.length !== 0 ? (
                <IonIcon
                  icon={chevronForward}
                  className="text-[1.5rem]"
                ></IonIcon>
              ) : (
                ``
              )}
            </button>
          </div>
        </div>
      </Swiper>
    </div>
  );
}
