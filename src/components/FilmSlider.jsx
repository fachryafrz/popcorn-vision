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

const FilmSlider = ({
  title,
  apiUrl,
  companies,
  apiGenres,
  apiUpcoming,
  apiSortBy,
}) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";
  let params = {
    api_key: apiKey,
    region: "US",
    include_adult: false,
    with_companies: companies,
    with_genres: apiGenres,
    "primary_release_date.gte": apiUpcoming,
    sort_by: apiSortBy,
  };

  console.log(params);

  if (isTvPage) {
    params = {
      api_key: apiKey,
      watch_region: "US",
      with_watch_providers: "2,3",
    };
  }

  useEffect(() => {
    const fetchMovies = async () => {
      axios
        .get(`https://api.themoviedb.org/3${apiUrl}`, {
          params,
        })
        .then((response) => {
          setMovies(response.data.results);
        });
    };

    fetchMovies();
  }, []);

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
  }, []);

  return (
    <div>
      <h2 className="sr-only">{title}</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
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
        className="px-4 py-[3rem] xl:px-[8rem] mx-2 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-base-dark-gray before:max-w-[9rem] before:z-10 after:absolute after:top-0 after:right-0 after:!w-[9rem] after:!h-full after:bg-gradient-to-l after:from-base-dark-gray after:z-10 before:hidden after:hidden xl:before:block xl:after:block before:pointer-events-none after:pointer-events-none"
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
              className="overflow-hidden hover:scale-105 active:scale-100 transition-all order-2"
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

        <div className="absolute top-2 md:top-0 left-0 right-0 h-8 !max-w-7xl mx-auto px-4 lg:px-[1rem] flex justify-between items-center xl:max-w-none">
          <p className="font-bold text-lg md:text-2xl">{title}</p>
          <div className="flex gap-4 items-center">
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
