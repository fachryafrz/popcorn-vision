import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";

export function SimilarMovies({ logo, movie, genres }) {
  return (
    <div id="Similar Movies">
      <h2 className="sr-only">Similar</h2>
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
        }}
        className="px-4 py-[5rem] lg:px-[16rem] mx-2 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-dark-gray before:max-w-[9rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[9rem] after:!h-full after:bg-gradient-to-l after:from-base-dark-gray after:z-10 before:hidden after:hidden lg:before:block lg:after:block before:pointer-events-none after:pointer-events-none"
      >
        {movie.similar &&
          movie.similar.results &&
          movie.similar.results.map((movie, index) => {
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
                <Link to={`/movies/${movie.id}`}>
                  <figure className="rounded-lg overflow-hidden aspect-poster">
                    <div
                      className={
                        movie.poster_path === null
                          ? `w-full h-full bg-base-dark-gray grid place-items-center`
                          : `hidden`
                      }
                    >
                      <img
                        src={logo}
                        alt={movie.title}
                        className="w-fit h-fit"
                      />
                    </div>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </figure>
                  <div className="mt-2">
                    <h3
                      title={movie.title}
                      className="font-bold text-lg line-clamp-1"
                    >
                      {movie.title}
                    </h3>
                    <div className="whitespace-nowrap flex items-center gap-1">
                      <span className="text-gray-400 whitespace-nowrap">
                        {new Date(movie.release_date).getFullYear()} &bull;
                      </span>
                      {genres.length > 0 && (
                        <div>
                          {movieGenres.map((genre, index) => (
                            <span
                              key={index}
                              className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray text-sm mr-1"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}

        <div className="absolute top-[2rem] md:top-[1.5rem] left-0 right-0 h-8 !max-w-7xl mx-auto px-4 lg:px-[1rem] flex justify-between items-center xl:max-w-none">
          <p className="font-bold text-2xl lg:text-3xl">Similar</p>
          <div className="flex gap-4 items-center">
            <button className="prev h-[1.5rem]">
              <IonIcon icon={chevronBack} className="text-[1.5rem]"></IonIcon>
            </button>
            <button className="next h-[1.5rem]">
              <IonIcon
                icon={chevronForward}
                className="text-[1.5rem]"
              ></IonIcon>
            </button>
          </div>
        </div>
      </Swiper>
    </div>
  );
}
