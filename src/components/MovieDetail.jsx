import { IonIcon } from "@ionic/react";
import axios from "axios";
import * as Icons from "ionicons/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const MovieDetail = ({ id }) => {
  const [movie, setMovie] = useState([]);
  const [numActors, setNumActors] = useState(5);
  const [showAllActors, setShowAllActors] = useState(false);
  const [genres, setGenres] = useState([]);

  const handleShowAllActors = () => {
    setShowAllActors(!showAllActors);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovie = async () => {
      axios
        .get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            append_to_response: "credits,similar",
          },
        })
        .then((response) => {
          setMovie(response.data);
        });
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchGenres = async () => {
      axios
        .get("https://api.themoviedb.org/3/genre/movie/list", {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
          },
        })
        .then((response) => {
          setGenres(response.data.genres);
        });
    };

    fetchGenres();
  }, []);

  return (
    <div className="flex flex-col bg-base-dark-gray text-white">
      <figure className="max-h-[70vh] overflow-hidden z-0 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-0 aspect-video">
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          className="object-top"
        />
      </figure>
      <div className="z-10 -mt-[4rem] sm:-mt-[14rem]">
        <div className="mx-auto max-w-7xl flex gap-8 px-4 pb-[2rem] md:pb-[5rem]">
          <div className="max-w-[200px] hidden md:flex flex-col gap-2 lg:max-w-[250px] self-start sticky top-8">
            <figure className="aspect-poster rounded-xl overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
                alt={movie.title}
              />
            </figure>
            <Link
              to="/"
              className="w-full text-sm p-4 md:px-8 rounded-lg bg-base-gray bg-opacity-10 uppercase font-medium tracking-wider flex justify-center items-center gap-2 transition-all hover:bg-opacity-30 active:bg-opacity-50"
            >
              <IonIcon
                icon={Icons.homeOutline}
                className="!w-5 h-full aspect-square"
              />
              Go Home
            </Link>
          </div>
          <div className="flex flex-col gap-6 self-start w-full">
            <div className="flex gap-2 items-center md:gap-0">
              <div className="min-w-fit flex flex-col gap-1">
                <figure className="max-w-[100px] md:hidden lg:max-w-[250px] aspect-poster rounded-lg overflow-hidden self-start">
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
                    alt={movie.title}
                  />
                </figure>
                <Link
                  to="/"
                  className="flex gap-2 items-center justify-center bg-base-gray bg-opacity-10 py-2 rounded-lg text-sm hover:bg-opacity-30 active:bg-opacity-50 sm:hidden"
                >
                  <IonIcon
                    icon={Icons.homeOutline}
                    className="!w-4 h-full aspect-square"
                  />
                  Go Home
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-3xl lg:text-5xl line-clamp-2 md:py-2">
                  {movie.title}
                </h1>
                <div className="text-gray-400 sm:hidden text-sm flex flex-wrap gap-1 items-center">
                  {new Date(movie.release_date).getFullYear()} &bull;{" "}
                  {`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}{" "}
                  &bull;{" "}
                  {movie.genres &&
                    movie.genres.map((genre) => {
                      return (
                        <span
                          key={genre.id}
                          className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray self-start"
                        >
                          {genre.name}
                        </span>
                      );
                    })}
                </div>
                <table className="max-w-fit hidden sm:block">
                  <tbody>
                    <tr>
                      <td className="pr-8 py-1 text-gray-400">Genre</td>
                      <td className="flex gap-1">
                        {movie.genres &&
                          movie.genres.map((genre) => {
                            return (
                              <span
                                key={genre.id}
                                className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray self-center"
                              >
                                {genre.name}
                              </span>
                            );
                          })}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-8 py-1 text-gray-400">Runtime</td>
                      <td>{`${Math.floor(movie.runtime / 60)}h ${
                        movie.runtime % 60
                      }m`}</td>
                    </tr>
                    <tr>
                      <td className="pr-8 py-1 text-gray-400">Release Date</td>
                      <td>{new Date(movie.release_date).getFullYear()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="prose max-w-none text-white">
              <div className="flex flex-col gap-2 ">
                <h2 className="text-white m-0">Overview</h2>
                <p className="text-gray-400 text-lg">{movie.overview}</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-4 self-start sticky top-8 w-[500px]">
            <h2 className="font-bold text-2xl">Cast & Crews</h2>
            <div className="flex flex-col gap-4">
              {movie.credits &&
                movie.credits.cast &&
                movie.credits.cast
                  .slice(
                    0,
                    showAllActors ? movie.credits.cast.length : numActors
                  )
                  .map((actor, index) => {
                    return (
                      <div key={index} className="flex gap-2 items-start">
                        <figure className="!w-[50px] !h-[50px] aspect-square bg-base-gray rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                            alt={actor.name}
                          />
                        </figure>
                        <div>
                          <h3
                            title={actor.name}
                            className="font-medium line-clamp-2"
                          >
                            {actor.name}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-1">
                            as{" "}
                            <span title={actor.character}>
                              {actor.character}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
              <button
                onClick={handleShowAllActors}
                className="text-primary-blue flex items-center justify-center bg-base-dark-gray gap-2 font-medium hover:bg-gray-600 py-2 px-4 rounded-t-lg sticky bottom-0"
              >
                {showAllActors ? "Hide" : "Show All"}
                <IonIcon
                  icon={
                    showAllActors
                      ? Icons.chevronUpCircleOutline
                      : Icons.chevronDownCircleOutline
                  }
                  className="text-[1.5rem]"
                />
              </button>
            </div>
          </div>
        </div>
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
                    <Link to={`/${movie.id}`}>
                      <figure className="rounded-lg overflow-hidden aspect-poster">
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
                  <IonIcon
                    icon={Icons.chevronBack}
                    className="text-[1.5rem]"
                  ></IonIcon>
                </button>
                <button className="next h-[1.5rem]">
                  <IonIcon
                    icon={Icons.chevronForward}
                    className="text-[1.5rem]"
                  ></IonIcon>
                </button>
              </div>
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
