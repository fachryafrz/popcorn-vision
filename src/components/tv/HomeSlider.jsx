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

const HomeSlider = ({ apiUrl }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovies = async () => {
      axios
        .get(`https://api.themoviedb.org/3${apiUrl}`, {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            watch_region: "US",
            with_watch_providers: "2,3",
            first_air_date_year: new Date().getFullYear() - 1,
          },
        })
        .then((response) => {
          setMovies(response.data.results.slice(0, 5));
        });
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    document.title = "Popcorn Prespective";
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
              className="min-h-fit sm:h-[90vh] flex items-end sm:p-4 lg:p-[4rem] relative before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-tr before:from-base-dark-gray before:via-base-dark-gray before:opacity-0 sm:before:opacity-[50%] after:absolute after:inset-0 after:bg-gradient-to-t lg:after:bg-gradient-to-tr after:from-base-dark-gray lg:after:opacity-[90%]"
            >
              <figure className="sm:absolute sm:inset-x-0 sm:top-0 min-h-fit sm:h-full -z-10 aspect-poster sm:aspect-auto">
                <img
                  src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
                  alt={movie.name}
                  className="object-top sm:hidden"
                />
                <img
                  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                  alt={movie.name}
                  className="object-top hidden sm:block"
                />
              </figure>
              <div className="hidden sm:flex flex-col gap-2 lg:gap-4 z-20 md:max-w-[70%] lg:max-w-[40%]">
                <h3 className="font-bold text-2xl lg:text-5xl line-clamp-1 lg:line-clamp-2">
                  {movie.name}
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
                      {new Date(movie.first_air_date).getFullYear()}
                    </span>
                  </div>
                </div>
                <p className="line-clamp-2 md:line-clamp-3">{movie.overview}</p>
                <div className="flex gap-4 mt-4">
                  <Link
                    to={`/tv/${movie.id}`}
                    className="w-full text-sm p-4 md:px-8 rounded-lg bg-primary-blue bg-opacity-60 uppercase font-medium tracking-wider flex justify-center items-center gap-1 transition-all md:max-w-fit hover:bg-opacity-100 hover:scale-105 active:scale-100 md:text-base"
                  >
                    <IonIcon
                      icon={informationCircleOutline}
                      className="!w-5 h-full aspect-square"
                    />
                    Details
                  </Link>
                  <a
                    href={`https://imdb.com/find/?q=${movie.name}`}
                    target="_blank"
                    className="w-full text-sm p-4 md:px-8 rounded-lg bg-base-gray bg-opacity-40 uppercase font-medium tracking-wider flex justify-center items-center gap-1 transition-all md:max-w-fit hover:bg-opacity-100 hover:scale-105 active:scale-100 md:text-base"
                  >
                    <IonIcon
                      icon={playOutline}
                      className="!w-5 h-full aspect-square"
                    />
                    Trailer
                  </a>
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
