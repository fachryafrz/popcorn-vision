import { IonIcon } from "@ionic/react";
import { informationCircleOutline, star } from "ionicons/icons";

import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Trending = ({ apiUrl }) => {
  const [movie, setMovie] = useState([]);

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";
  let params = {
    api_key: apiKey,
    region: "US",
    include_adult: false,
  };

  if (isTvPage) {
    params = {
      api_key: apiKey,
      watch_region: "US",
      with_watch_providers: "2,3",
    };
  }

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3${apiUrl}`, {
        params: {
          api_key: "84aa2a7d5e4394ded7195035a4745dbd",
        },
      })
      .then((response) => {
        setMovie(response.data.results.slice(0, 1)[0]);
      });
  }, []);

  return (
    <div className="px-4 lg:px-[9rem]">
      <h2 className="sr-only">
        {!isTvPage ? `Trending Movie` : `Trending TV Series`}
      </h2>
      <div className="relative flex flex-col items-center lg:flex-row gap-8 p-8 lg:p-[3rem] rounded-xl md:rounded-[3rem] overflow-hidden before:z-10 before:absolute before:inset-0 before:bg-gradient-to-t lg:before:bg-gradient-to-r before:from-black before:via-black before:opacity-[70%] before:invisible lg:before:visible after:z-20 after:absolute after:inset-0 after:bg-gradient-to-t lg:after:bg-gradient-to-r after:from-black">
        <figure className="absolute inset-0 z-0 blur-md lg:blur-md">
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
            alt={!isTvPage ? movie.title : movie.name}
          />
        </figure>
        <figure className="z-30 max-w-[300px] aspect-poster rounded-2xl overflow-hidden">
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            alt={!isTvPage ? movie.title : movie.name}
          />
        </figure>
        <div className="z-30 flex flex-col items-center text-center gap-2 md:max-w-[60%] lg:max-w-[50%] lg:items-start lg:text-start">
          <div className="flex gap-2 items-center">
            <IonIcon icon={star} className="text-primary-yellow text-xl" />
            <span className="text-lg font-bold">
              {Math.round(movie.vote_average * 10) / 10}
            </span>
          </div>
          <h3 className="font-bold text-2xl lg:text-3xl">
            {!isTvPage ? movie.title : movie.name} (
            {new Date(
              !isTvPage ? movie.release_date : movie.first_air_date
            ).getFullYear()}
            )
          </h3>
          <p className="line-clamp-4">{movie.overview}</p>
          <Link
            to={!isTvPage ? `/movies/${movie.id}` : `/tv/${movie.id}`}
            className="btn bg-primary-yellow text-black mt-4"
          >
            <IonIcon
              icon={informationCircleOutline}
              className="!w-5 h-full aspect-square"
            />
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Trending;
