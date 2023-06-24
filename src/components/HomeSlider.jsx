// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper";

import { Link, useLocation } from "react-router-dom";

// Ionic Icons
import { IonIcon } from "@ionic/react";
import { star, informationCircleOutline, playOutline } from "ionicons/icons";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

import axios from "axios";
import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import MovieTitleLogo from "./MovieTitleLogo";

const HomeSlider = ({ apiUrl, apiUpcoming, apiSortBy = "popularity.desc" }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";
  let params = {
    api_key: apiKey,
    sort_by: apiSortBy,
    region: "US",
    include_adult: false,
  };

  if (isTvPage) {
    params = {
      api_key: apiKey,
      sort_by: apiSortBy,
      watch_region: "US",
      with_watch_providers: "8",
      first_air_date_year: apiUpcoming,
    };
  }

  useEffect(() => {
    setLoading(true);

    const fetchMovies = async () => {
      axios
        .get(`https://api.themoviedb.org/3${apiUrl}`, {
          params,
        })
        .then((response) => {
          setMovies(response.data.results.slice(0, 5));
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    };

    fetchMovies();
  }, [apiUrl]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    document.title = "Popcorn Vision";
  }, []);

  return (
    <div>
      <h2 className="sr-only">
        {!isTvPage ? `Discover Movies` : `Discover TV Series`}
      </h2>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={0}
        slidesPerView={1}
        className={`lg:rounded-bl-[3rem] xl:ml-[5rem] ${
          loading && `h-[500px] sm:h-[600px]`
        }`}
      >
        {movies.map((movie, index) => {
          return (
            <SwiperSlide
              key={index}
              className="min-h-fit sm:h-[600px] flex items-end relative after:absolute after:inset-0 after:bg-gradient-to-t lg:after:bg-gradient-to-tr after:from-base-dark-gray lg:after:opacity-[90%]"
            >
              <figure className="min-h-fit w-full sm:h-full -z-10 aspect-poster sm:aspect-auto">
                {loading ? (
                  <Loading classNames={`h-[600px]`} />
                ) : (
                  <img
                    loading="lazy"
                    src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                    alt={!isTvPage ? movie.title : movie.name}
                    className="object-top sm:hidden"
                  />
                )}
                {loading ? (
                  <Loading classNames={`h-[600px]`} />
                ) : (
                  <img
                    loading="lazy"
                    src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                    alt={!isTvPage ? movie.title : movie.name}
                    className="object-top hidden sm:block"
                  />
                )}
              </figure>
              <div className="flex flex-col items-center sm:items-start gap-2 lg:gap-2 z-20 md:max-w-[70%] lg:max-w-[50%] absolute bottom-0 inset-x-0 p-4 xl:p-[4rem] before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-r before:from-base-dark-gray h-full justify-end [&_*]:z-10">
                {/* <h3 className="font-bold text-2xl lg:text-5xl line-clamp-1 lg:line-clamp-2 !leading-tight">
                  {!isTvPage ? movie.title : movie.name}
                </h3> */}

                {loading ? (
                  <Loading
                    height="[150px]"
                    width="[300px]"
                    className="w-[300px]"
                  />
                ) : (
                  <MovieTitleLogo movie={movie.id} isTvPage={isTvPage} />
                )}

                {loading ? (
                  <Loading
                    height="[30px]"
                    width="[150px]"
                    className="w-[150px]"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <IonIcon
                        icon={star}
                        className="text-primary-yellow !w-5 h-full aspect-square"
                      />
                      <span className="text-base md:text-xl text-white">
                        {Math.round(movie.vote_average * 10) / 10}
                      </span>
                    </div>

                    <span>&bull;</span>
                    <div className="whitespace-nowrap flex items-center gap-2">
                      <span className="text-gray-400">
                        {new Date(
                          !isTvPage ? movie.release_date : movie.first_air_date
                        ).getFullYear()}
                      </span>
                    </div>
                  </div>
                )}

                {loading ? (
                  <Loading height="[120px]" className="h-[120px]" />
                ) : (
                  <p className="line-clamp-2 md:line-clamp-3">
                    {movie.overview}
                  </p>
                )}

                {!loading && (
                  <div className="flex gap-2 mt-4 w-full">
                    <Link
                      to={!isTvPage ? `/movies/${movie.id}` : `/tv/${movie.id}`}
                      className="btn bg-primary-blue bg-opacity-60"
                    >
                      <IonIcon
                        icon={informationCircleOutline}
                        className="!w-5 h-full aspect-square"
                      />
                      Details
                    </Link>
                    <Link
                      to={
                        !isTvPage
                          ? `/movies/${movie.id}#overview`
                          : `/tv/${movie.id}#overview`
                      }
                      className="btn bg-base-gray bg-opacity-40"
                    >
                      <IonIcon
                        icon={playOutline}
                        className="!w-5 h-full aspect-square"
                      />
                      Trailer
                    </Link>
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
