// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper";

import { Link } from "react-router-dom";

// Ionic Icons
import { IonIcon } from "@ionic/react";
import { star, informationCircleOutline, playOutline } from "ionicons/icons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

import axios from "axios";
import { useEffect, useState } from "react";

const HomeSlider = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      axios
        .get("https://api.themoviedb.org/3/movie/now_playing", {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
          },
        })
        .then((response) => {
          setMovies(response.data.results.slice(0, 5));
        });
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <h2 className="sr-only">Movie Highlights</h2>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={0}
        slidesPerView={1}
        className="lg:rounded-bl-[3rem] lg:ml-[5rem]"
      >
        {movies.map((movie, index) => {
          return (
            <SwiperSlide
              key={index}
              className="h-[50vh] md:h-[90vh] flex items-end p-4 lg:p-[4rem] relative before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-tr before:from-base-dark-gray before:via-base-dark-gray before:opacity-[50%] after:absolute after:inset-0 after:bg-gradient-to-t lg:after:bg-gradient-to-tr after:from-base-dark-gray lg:after:opacity-[90%]"
            >
              <figure className="absolute inset-0 -z-10">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                  className="object-top"
                />
              </figure>
              <div className="flex flex-col gap-2 lg:gap-4 z-20 md:max-w-[70%] lg:max-w-[40%]">
                <h3 className="font-bold text-2xl lg:text-5xl line-clamp-1 lg:line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <IonIcon
                      icon={star}
                      className="text-primary-yellow !w-5 h-full aspect-square"
                    />
                    <span className="text-base md:text-xl text-white">
                      {movie.vote_average}
                    </span>
                  </div>
                  <span>|</span>
                  <div className="whitespace-nowrap flex items-center gap-2">
                    <span className="text-gray-400">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                </div>
                <p className="line-clamp-1 md:line-clamp-3">{movie.overview}</p>
                <div className="flex gap-4 mt-4">
                  <Link
                    to={`/${movie.id}`}
                    className="w-full text-sm p-4 md:px-8 rounded-lg bg-primary-blue bg-opacity-60 uppercase font-medium tracking-wider flex justify-center items-center gap-1 transition-all md:max-w-fit hover:bg-opacity-100 hover:scale-105 active:scale-100 md:text-base"
                  >
                    <IonIcon
                      icon={informationCircleOutline}
                      className="!w-5 h-full aspect-square"
                    />
                    Details
                  </Link>
                  <Link
                    to="#!"
                    className="w-full text-sm p-4 md:px-8 rounded-lg bg-base-gray bg-opacity-40 uppercase font-medium tracking-wider flex justify-center items-center gap-1 transition-all md:max-w-fit hover:bg-opacity-100 hover:scale-105 active:scale-100 md:text-base"
                  >
                    <IonIcon
                      icon={playOutline}
                      className="!w-5 h-full aspect-square"
                    />
                    Trailer
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
