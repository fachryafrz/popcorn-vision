import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Loading } from "./Loading";
import ReactMarkdown from "react-markdown";
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Mousewheel,
  Navigation,
  Thumbs,
  Zoom,
} from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";
import FilmReviews from "./FilmReviews";
import axios from "axios";
import MovieTitleLogo from "./MovieTitleLogo";

export function MovieOverview({
  logo,
  movie,
  isTvPage,
  loading,
  reviews,
  backdrops,
}) {
  const history = useHistory();
  const [thumbsSwiper, setThumbsSwiper] = useState();
  const filteredVideos =
    movie.videos &&
    movie.videos.results.filter(
      (result) =>
        (result.site === "YouTube" &&
          result.official === true &&
          result.iso_639_1 === "en" &&
          result.type === "Trailer") ||
        result.type === "Teaser" ||
        result.type === "Clip"
    );
  const [movieTitle, setMovieTitle] = useState();
  const [collections, setCollections] = useState({});

  const dateStr = !isTvPage ? movie.release_date : movie.first_air_date;
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  const handleGoBack = () => {
    history.goBack();
  };

  useEffect(() => {
    const url = window.location.href;
    const hasOverview = url.includes("#overview");

    if (hasOverview) {
      const element = document.getElementById("overview");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [movie]);

  useEffect(() => {
    const fetchMovieTitleLogo = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/${!isTvPage ? `movie` : `tv`}/${
            movie.id
          }/images`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
              language: "en",
            },
          }
        )
        .then((response) => {
          setMovieTitle(response.data.logos[0]);
        });
    };

    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/collection/${
            movie &&
            movie.belongs_to_collection &&
            movie.belongs_to_collection.id
          }
          `,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setCollections(response.data);
      } catch (error) {
        console.error(`Errornya collections: ${error}`);
      }
    };

    fetchCollections();
    fetchMovieTitleLogo();
  }, [movie]);

  return (
    <div className="flex flex-col gap-6 self-start w-full">
      <div className="flex gap-4 flex-col items-center sm:items-stretch sm:flex-row lg:gap-0">
        <div className="flex flex-col gap-1">
          <div className="sticky top-20 flex flex-col gap-1">
            <figure className="w-[50vw] sm:w-[25vw] lg:hidden aspect-poster rounded-lg overflow-hidden self-start">
              <div
                className={
                  movie.poster_path === null
                    ? `w-full h-full bg-base-dark-gray`
                    : `hidden`
                }
              >
                <img
                  loading="lazy"
                  src={logo}
                  alt={import.meta.env.VITE_APP_NAME}
                  className="w-fit h-fit"
                />
              </div>
              {loading ? (
                <Loading />
              ) : (
                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={!isTvPage ? movie.title : movie.name}
                  className={movie.poster_path === null ? `hidden` : `block`}
                />
              )}
            </figure>
            {/* <button
              onClick={handleGoBack}
              className="flex gap-2 text-xs sm:text-sm items-center justify-center bg-base-gray bg-opacity-10 py-2 rounded-lg hover:bg-opacity-30 active:bg-opacity-50 md:hidden"
            >
              <IonIcon
                icon={Icons.returnDownBack}
                className="!w-4 h-full aspect-square"
              />
              Go Back
            </button> */}
          </div>
        </div>
        <div className="flex flex-col items-center md:justify-center sm:items-start gap-2 sm:gap-0 w-full">
          {loading ? (
            <Loading height="[50px] md:!w-[500px]" className={`h-[50px]`} />
          ) : (
            <>
              {movieTitle && movieTitle !== null ? (
                <MovieTitleLogo movie={movie.id} isTvPage={isTvPage} />
              ) : (
                <h1
                  title={!isTvPage ? movie.title : movie.name}
                  className="max-w-fit font-bold text-2xl lg:text-5xl line-clamp-2 md:line-clamp-3 md:py-2 !leading-tight"
                >
                  {!isTvPage ? movie.title : movie.name}
                </h1>
              )}
            </>
          )}

          {loading ? (
            <Loading
              height="[100px] sm:h-[150px] mt-2 sm:!w-[400px]"
              className={`h-[100px] sm:h-[150px]`}
            />
          ) : (
            <table className="w-full md:max-w-fit text-base first:[&_td]:pr-2 sm:first:[&_td]:pr-6 first:[&_td]:align-top [&_td]:leading-relaxed first:[&_td]:whitespace-nowrap">
              <tbody>
                {!isTvPage
                  ? movie.production_companies &&
                    movie.production_companies.length > 0 && (
                      <tr>
                        <td className="text-gray-400 whitespace-nowrap">
                          Produced by
                        </td>
                        <td className={` line-clamp-1 xl:line-clamp-none`}>
                          {movie.production_companies
                            .map((item) => item.name)
                            .join(", ")}
                        </td>
                      </tr>
                    )
                  : movie.production_companies.length > 0 && (
                      <tr>
                        <td className="text-gray-400 whitespace-nowrap">
                          Produced by
                        </td>
                        <td className={` line-clamp-1 xl:line-clamp-none`}>
                          {movie.production_companies
                            .map((item) => item.name)
                            .join(", ")}
                        </td>
                      </tr>
                    )}

                {!isTvPage
                  ? movie.credits &&
                    movie.credits.crew.length > 0 &&
                    movie.credits.crew.find(
                      (person) => person.job === "Director"
                    ) !== null && (
                      <tr>
                        <td className="text-gray-400 whitespace-nowrap">
                          Directed by
                        </td>
                        <td className={``}>
                          {
                            movie.credits.crew.find(
                              (person) => person.job === "Director"
                            ).name
                          }
                        </td>
                      </tr>
                    )
                  : movie.created_by.length > 0 && (
                      <tr>
                        <td className="text-gray-400 whitespace-nowrap">
                          Directed by
                        </td>
                        <td className={``}>
                          {movie.created_by.map((item) => item.name).join(", ")}
                        </td>
                      </tr>
                    )}

                {movie.release_date || movie.first_air_date ? (
                  <tr>
                    <td className="text-gray-400">
                      {!isTvPage ? `Release Date` : `Air Date`}
                    </td>
                    {!isTvPage ? (
                      <td>{formattedDate}</td>
                    ) : (
                      <td>
                        {formattedDate}{" "}
                        {movie.last_air_date !== null &&
                        movie.last_air_date !== movie.first_air_date ? (
                          <span className="hidden xs:inline">
                            {`- ${new Date(movie.last_air_date).toLocaleString(
                              "en-US",
                              options
                            )}`}
                          </span>
                        ) : null}
                      </td>
                    )}
                  </tr>
                ) : null}

                {isTvPage && (
                  <tr>
                    <td className="text-gray-400">Chapter</td>
                    <td className={``}>
                      {`${movie.number_of_seasons} Season${
                        movie.number_of_seasons > 1 ? `s` : ``
                      }`}{" "}
                      {`(${movie.number_of_episodes} Episode${
                        movie.number_of_episodes > 1 ? `s` : ``
                      })`}
                    </td>
                  </tr>
                )}

                {movie.genres && movie.genres.length > 0 && (
                  <tr>
                    <td className="text-gray-400">Genre</td>
                    {/* <td className="flex gap-1 flex-wrap">
                    {movie.genres &&
                      movie.genres.map((genre) => {
                        return (
                          <span
                            key={genre.id}
                            className="py-0.5 px-2 bg-base-gray bg-opacity-40 backdrop-blur-sm rounded-lg text-gray-200 border border-base-gray self-start"
                          >
                            {genre.name}
                          </span>
                        );
                      })}
                  </td> */}
                    <td className={``}>
                      {movie.genres.map((item) => item.name).join(", ")}
                    </td>
                  </tr>
                )}

                {!isTvPage
                  ? movie.runtime > 0 && (
                      <tr>
                        <td className="text-gray-400">Runtime</td>

                        {Math.floor(movie.runtime / 60) >= 1 ? (
                          <td>
                            {Math.floor(movie.runtime / 60)}h{" "}
                            {movie.runtime % 60}m
                          </td>
                        ) : (
                          <td>
                            {movie.runtime % 60} minute
                            {movie.runtime % 60 > 1 && `s`}
                          </td>
                        )}
                      </tr>
                    )
                  : movie.episode_run_time.length > 0 && (
                      <tr>
                        <td className="text-gray-400">Runtime</td>

                        {Math.floor(movie.episode_run_time[0] / 60) >= 1 ? (
                          <td>
                            {Math.floor(movie.episode_run_time[0] / 60)}h{" "}
                            {movie.episode_run_time[0] % 60}m
                          </td>
                        ) : (
                          <td>
                            {movie.episode_run_time[0] % 60} minute
                            {movie.episode_run_time[0] % 60 > 1 && `s`}
                          </td>
                        )}
                      </tr>
                    )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="text-white flex flex-col gap-6">
        <div id="overview" className="flex flex-col gap-2 ">
          {loading ? (
            <Loading height="[30px] !w-[150px]" className={`h-[30px]`} />
          ) : (
            <h2 className="font-bold text-xl text-white m-0">Overview</h2>
          )}
          {loading ? (
            <Loading height="[150px]" className={`h-[150px]`} />
          ) : (
            <p className="text-gray-400 md:text-lg">{movie.overview}</p>
          )}
        </div>
        {movie.videos &&
          movie.videos.results.length > 0 &&
          backdrops &&
          backdrops.length > 0 && (
            <div className="flex flex-col gap-2 ">
              {loading ? (
                <Loading
                  height="auto aspect-video !w-full"
                  className={`h-auto`}
                />
              ) : (
                <div className="max-w-full">
                  <Swiper
                    modules={[
                      FreeMode,
                      Navigation,
                      Thumbs,
                      Autoplay,
                      EffectFade,
                      Mousewheel,
                      Zoom,
                    ]}
                    zoom={true}
                    effect="fade"
                    thumbs={{ swiper: thumbsSwiper }}
                    spaceBetween={16}
                    // mousewheel={true}
                    navigation={{
                      enabled: true,
                      nextEl: "#next",
                      prevEl: "#prev",
                    }}
                    // autoplay={{
                    //   delay: 3000,
                    //   disableOnInteraction: true,
                    //   pauseOnMouseEnter: true,
                    // }}
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    }}
                    className="relative aspect-video rounded-lg overflow-hidden"
                  >
                    <div
                      id="navigation"
                      className={`flex justify-between absolute inset-0 items-center flex-row-reverse px-4`}
                    >
                      <button
                        id="next"
                        className={`z-40 grid place-items-center shadow rounded-full bg-white text-base-dark-gray p-1`}
                      >
                        <IonIcon
                          icon={Icons.chevronForward}
                          className={`text-[1.25rem]`}
                        />
                      </button>
                      <button
                        id="prev"
                        className={`z-40 grid place-items-center shadow rounded-full bg-white text-base-dark-gray p-1`}
                      >
                        <IonIcon
                          icon={Icons.chevronBack}
                          className={`text-[1.25rem]`}
                        />
                      </button>
                    </div>
                    {filteredVideos
                      .reverse()
                      .slice(0, 5)
                      .map((vid, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <iframe
                              src={`https://youtube.com/embed/${vid.key}?rel=0&start=0`}
                              title="YouTube video player"
                              loading="lazy"
                              frameBorder="0"
                              allowFullScreen
                              className={`w-full h-full`}
                            ></iframe>
                          </SwiperSlide>
                        );
                      })}

                    {backdrops.map((img, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <figure className="swiper-zoom-container">
                            <img
                              loading="lazy"
                              src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                              alt={``}
                              className={`w-full h-full object-cover`}
                            />
                          </figure>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              )}
            </div>
          )}

        {!isTvPage && (
          <div className={`flex flex-col gap-2`}>
            <div id="collections" className="flex flex-col gap-2 ">
              {loading ? (
                <Loading height="[30px] !w-[150px]" className={`h-[30px]`} />
              ) : (
                <h2 className="font-bold text-xl text-white m-0">
                  {collections && collections.name}
                </h2>
              )}
            </div>
            <ul className="flex flex-col gap-1">
              {collections.parts &&
                collections.parts.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to={`/movies/${item.id}`}
                        className="flex items-center gap-2 bg-base-gray bg-opacity-10 hover:bg-opacity-30 p-2 rounded-xl w-full"
                      >
                        {!loading && (
                          <span
                            className={`text-gray-400 text-sm font-medium px-1`}
                          >
                            {index + 1}
                          </span>
                        )}
                        <figure className="aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden">
                          {loading ? (
                            <Loading
                              classNames={`!min-w-[50px] !max-w-[50px]`}
                            />
                          ) : (
                            <img
                              src={
                                item.poster_path
                                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                  : logo
                              }
                              alt={item.title}
                              className={`object-contain`}
                            />
                          )}
                        </figure>
                        <div className="flex flex-col gap-1 items-start w-full">
                          {loading ? (
                            <Loading classNames={`!h-[20px] !max-w-[200px]`} />
                          ) : (
                            <p
                              className="text-start line-clamp-2 font-medium"
                              title={item.title}
                            >
                              {item.title}
                            </p>
                          )}
                          {loading ? (
                            <Loading classNames={`!h-[10px] !max-w-[50px]`} />
                          ) : (
                            <div className="text-sm text-gray-400 font-medium">
                              {item.release_date
                                ? new Date(item.release_date).getFullYear()
                                : `Coming soon`}
                            </div>
                          )}
                        </div>
                        {loading ? (
                          <Loading classNames={`h-[75px]`} />
                        ) : (
                          <p className="text-xs text-gray-400 line-clamp-3 w-full">
                            {item.overview}
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}

        {reviews && reviews.length !== 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center justify-between bg-base-dark-gray sticky top-[4.125rem] py-2 bg-opacity-90 backdrop-blur-sm z-10">
              {loading ? (
                <Loading height="[30px] max-w-[100px]" className={`h-[30px]`} />
              ) : (
                <h2 className="font-bold text-xl text-white m-0">Reviews</h2>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {reviews &&
                reviews
                  .slice()
                  .reverse()
                  .map((review, index) => {
                    return (
                      <FilmReviews
                        key={index}
                        loading={loading}
                        logo={logo}
                        review={review}
                      />
                    );
                  })}
            </div>
          </div>
        ) : (
          ``
        )}
      </div>
    </div>
  );
}
