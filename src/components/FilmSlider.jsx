import { FilmCard } from "./FilmCard";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";

import axios from "axios";
import { useEffect, useState } from "react";

import "swiper/css/navigation";
import "swiper/css/autoplay";

import logo from "/popcorn.png";
import { useLocation } from "react-router-dom";
import { Loading } from "./Loading";

const FilmSlider = ({
  title,
  apiUrl,
  apiCompanies,
  apiGenres,
  apiUpcoming,
  apiSortBy = "popularity.desc",
}) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";
  let params = {
    api_key: apiKey,
    sort_by: apiSortBy,
    region: "US",
    include_adult: false,
    with_companies: apiCompanies,
    with_genres: apiGenres,
    "primary_release_date.gte": apiUpcoming,
  };

  if (isTvPage) {
    params = {
      api_key: apiKey,
      sort_by: apiSortBy,
      watch_region: "US",
      "first_air_date.gte": apiUpcoming,
      with_companies: apiCompanies,
      with_genres: apiGenres,
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
          setMovies(response.data.results);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    };

    fetchMovies();
  }, [isTvPage]);

  useEffect(() => {
    const fetchGenres = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/genre/${
            !isTvPage ? `movie` : `tv`
          }/list`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        )
        .then((response) => {
          setGenres(response.data.genres);
        });
    };

    fetchGenres();
  }, [isTvPage]);

  return (
    <div>
      <h2 className="sr-only">{title}</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={8}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
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
        className={`px-4 py-[3rem] xl:px-[9rem] pr-[5rem] relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-dark-gray before:max-w-[9rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[9rem] after:!h-full after:bg-gradient-to-l after:from-base-dark-gray after:z-10 before:hidden after:hidden xl:before:block xl:after:block before:pointer-events-none after:pointer-events-none ${
          loading && `h-[50vh] sm:h-[55vh] md:h-[60vh] xl:h-[70vh]`
        }`}
      >
        {movies.map((movie, index) => {
          const movieGenres =
            movie.genre_ids && genres
              ? movie.genre_ids.map((genreId) =>
                  genres.find((genre) => genre.id === genreId)
                )
              : [];

          return (
            <SwiperSlide
              key={index}
              className={`overflow-hidden hover:scale-[1.025] active:scale-100 transition-all order-2 ${
                loading &&
                `max-w-[50vw] sm:max-w-[33.3vw] md:max-w-[25vw] lg:max-w-[20vw]`
              }`}
            >
              <FilmCard
                movie={movie}
                logo={logo}
                movieGenres={movieGenres}
                isTvPage={isTvPage}
                loading={loading}
              />
            </SwiperSlide>
          );
        })}

        <div className="absolute top-2 md:top-0 left-0 right-0 h-8 px-4 xl:px-[9rem] flex justify-between items-center xl:max-w-none">
          {loading ? (
            <Loading classNames={`h-[30px] max-w-[150px]`} />
          ) : (
            <p className="font-bold text-lg md:text-2xl">{title}</p>
          )}

          <div
            className={`flex gap-4 items-center ${
              loading ? `opacity-0` : `opacity-100`
            }`}
          >
            <button className="prev h-[1.5rem]" aria-label="Move slider left">
              <IonIcon icon={chevronBack} className="text-[1.5rem]"></IonIcon>
            </button>
            <button className="next h-[1.5rem]" aria-label="Move slider right">
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
};

export default FilmSlider;
