import { IonIcon } from "@ionic/react";
import { informationCircleOutline, star } from "ionicons/icons";

import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MovieTitleLogo from "./MovieTitleLogo";
import { Loading } from "./Loading";

const Trending = ({ num }) => {
  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  const apiKey = "84aa2a7d5e4394ded7195035a4745dbd";

  useEffect(() => {
    setLoading(true);

    const fetchTrending = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/trending/${
            !isTvPage ? `movie` : `tv`
          }/week`,
          {
            params: {
              api_key: apiKey,
            },
          }
        );
        setMovie(response.data.results[num - 1]);
      } catch (error) {
        console.error(`Errornya trending: ${error}`);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 250);
      }
    };

    fetchTrending();
  }, [isTvPage]);

  return (
    <div className="px-4 xl:px-[9rem]">
      <h2 className="sr-only">
        {!isTvPage ? `Trending Movie` : `Trending TV Series`}
      </h2>
      <div className="relative flex flex-col items-center md:flex-row gap-8 p-8 md:p-[3rem] rounded-[2rem] md:rounded-[3rem] overflow-hidden before:z-10 before:absolute before:inset-0 before:bg-gradient-to-t md:before:bg-gradient-to-r before:from-black before:via-black before:opacity-[70%] before:invisible md:before:visible after:z-20 after:absolute after:inset-0 after:bg-gradient-to-t md:after:bg-gradient-to-r after:from-black">
        <figure className="absolute inset-0 z-0 blur-md md:blur-md">
          {loading ? (
            <Loading classNames={`h-[600px]`} />
          ) : (
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_API_IMAGE_URL_780}${
                movie.backdrop_path
              }`}
              alt={!isTvPage ? movie.title : movie.name}
            />
          )}
        </figure>
        <figure className="z-30 max-w-[300px] aspect-poster rounded-2xl overflow-hidden">
          {loading ? (
            <Loading classNames="h-[400px] w-[250px] sm:h-[450px] sm:w-[300px]" />
          ) : (
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_API_IMAGE_URL_780}${
                movie.poster_path
              }`}
              alt={!isTvPage ? movie.title : movie.name}
            />
          )}
        </figure>
        <div className="z-30 flex flex-col items-center text-center gap-2 md:max-w-[60%] lg:max-w-[50%] md:items-start md:text-start">
          {/* <h3 className="font-bold text-2xl md:text-3xl">
            {!isTvPage ? movie.title : movie.name} (
            {new Date(
              !isTvPage ? movie.release_date : movie.first_air_date
            ).getFullYear()}
            )
          </h3> */}

          <div className="hidden md:block">
            {loading ? (
              <Loading height="[150px]" width="[300px]" className="w-[300px]" />
            ) : (
              <MovieTitleLogo movie={movie.id} isTvPage={isTvPage} />
            )}
          </div>
          {loading ? (
            <Loading height="[30px]" width="[150px]" className="w-[150px]" />
          ) : (
            <div className="flex gap-2 items-center">
              <IonIcon icon={star} className="text-primary-yellow text-xl" />
              <span className="text-lg font-bold">
                {Math.round(movie.vote_average * 10) / 10}
              </span>
              <span>&bull;</span>
              <time className="text-lg font-bold">
                {new Date(
                  !isTvPage ? movie.release_date : movie.first_air_date
                ).getFullYear()}
              </time>
            </div>
          )}
          {loading ? (
            <Loading
              height="[120px]"
              classNames={`h-[120px] w-[250px] sm:w-[500px]`}
            />
          ) : (
            <p className="line-clamp-4">{movie.overview}</p>
          )}
          {!loading && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending;
