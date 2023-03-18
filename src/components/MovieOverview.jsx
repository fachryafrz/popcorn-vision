import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Mousewheel,
  Navigation,
  Thumbs,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Loading } from "./Loading";
import ReactMarkdown from "react-markdown";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import FilmReviews from "./FilmReviews";

export function MovieOverview({ logo, movie, page, isTvPage, loading }) {
  const history = useHistory();
  const [thumbsSwiper, setThumbsSwiper] = useState();
  const filteredVideos =
    movie.videos &&
    movie.videos.results.filter(
      (result) => result.site === "YouTube" && result.official === true
    );

  const handleGoBack = () => {
    history.goBack();
  };
  return (
    <div className="flex flex-col gap-6 self-start w-full">
      <div className="flex gap-2 items-center md:gap-0">
        <div className="min-w-fit flex flex-col gap-1">
          <figure className="h-[150px] max-w-[100px] md:hidden lg:max-w-[250px] aspect-poster rounded-lg overflow-hidden self-start">
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
                alt="Popcorn Prespective"
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
          <button
            onClick={handleGoBack}
            className="flex gap-2 items-center justify-center bg-base-gray bg-opacity-10 py-2 rounded-lg text-sm hover:bg-opacity-30 active:bg-opacity-50 md:hidden"
          >
            <IonIcon
              icon={Icons.returnDownBack}
              className="!w-4 h-full aspect-square"
            />
            Go Back
          </button>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {loading ? (
            <Loading height="[50px] md:!w-[500px]" className={`h-[50px]`} />
          ) : (
            <h1
              title={!isTvPage ? movie.title : movie.name}
              className="max-w-fit font-bold text-3xl lg:text-5xl line-clamp-2 md:line-clamp-3 md:py-2"
            >
              {!isTvPage ? movie.title : movie.name}
            </h1>
          )}

          {loading ? (
            <Loading
              height="[20px] sm:hidden"
              className={`h-[20px] sm:hidden`}
            />
          ) : (
            <div className="text-gray-400 sm:hidden text-sm flex flex-wrap gap-1 items-center">
              {!isTvPage ? (
                <span>{new Date(movie.release_date).getFullYear()}</span>
              ) : (
                <span>
                  {`${movie.number_of_seasons} Season${
                    movie.number_of_seasons > 1 ? `s` : ``
                  } (${movie.number_of_episodes} Episode${
                    movie.number_of_episodes > 1 ? `s` : ``
                  }) `}
                  &bull; {new Date(movie.first_air_date).getFullYear()}{" "}
                  {new Date(movie.last_air_date).getFullYear() ===
                  new Date(movie.first_air_date).getFullYear()
                    ? null
                    : `- ${new Date(movie.last_air_date).getFullYear()}`}
                </span>
              )}
              &bull;{" "}
              {!isTvPage
                ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                : `${
                    movie.last_episode_to_air.runtime &&
                    movie.last_episode_to_air.runtime
                  }m`}{" "}
              &bull;
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
          )}

          {loading ? (
            <Loading
              height="[150px] !w-[400px] hidden sm:block"
              className={`h-[150px]`}
            />
          ) : (
            <table className="max-w-fit hidden sm:block [&_td]:py-1 [&_td]:whitespace-nowrap">
              <tbody>
                {/* <tr>
                  <td className="pr-8 py-1 text-gray-400 whitespace-nowrap">
                    {!isTvPage ? `Produced by` : `Created by`}
                  </td>
                  <td className={`!whitespace-normal`}>
                    {!isTvPage
                      ? movie.production_companies
                          .map((item) => item.name)
                          .join(", ")
                      : movie.created_by.map((item) => item.name).join(", ")}
                  </td>
                </tr> */}
                <tr>
                  <td className="pr-8 py-1 text-gray-400">Runtime</td>
                  <td>
                    {!isTvPage
                      ? `${Math.floor(movie.runtime / 60)}h ${
                          movie.runtime % 60
                        }m`
                      : `${
                          movie.last_episode_to_air.runtime &&
                          movie.last_episode_to_air.runtime
                        }m`}
                  </td>
                </tr>
                <tr>
                  <td className="pr-8 py-1 text-gray-400">Release Date</td>
                  {!isTvPage ? (
                    <td>{new Date(movie.release_date).getFullYear()}</td>
                  ) : (
                    <td>
                      {new Date(movie.first_air_date).getFullYear()}{" "}
                      {new Date(movie.last_air_date).getFullYear() ===
                      new Date(movie.first_air_date).getFullYear()
                        ? null
                        : `- ${new Date(movie.last_air_date).getFullYear()}`}
                    </td>
                  )}
                </tr>
                {isTvPage && (
                  <tr>
                    <td className="pr-8 py-1 text-gray-400">Chapter</td>
                    <td>
                      {`${movie.number_of_seasons} Season${
                        movie.number_of_seasons > 1 ? `s` : ``
                      }`}{" "}
                      {`(${movie.number_of_episodes} Episode${
                        movie.number_of_episodes > 1 ? `s` : ``
                      })`}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="pr-8 py-1 text-gray-400">Genre</td>
                  <td className="flex gap-1 flex-wrap">
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
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="text-white flex flex-col gap-6">
        <div className="flex flex-col gap-2 ">
          {loading ? (
            <Loading height="[30px] !w-[150px]" className={`h-[30px]`} />
          ) : (
            <h2 className="font-bold text-2xl text-white m-0">Overview</h2>
          )}
          {loading ? (
            <Loading height="[150px]" className={`h-[150px]`} />
          ) : (
            <p className="text-gray-400 text-lg">{movie.overview}</p>
          )}
        </div>
        {movie.images && movie.images.backdrops.length !== 0 ? (
          <div className="flex flex-col gap-2 ">
            {loading ? (
              <Loading
                height="auto aspect-video !w-full"
                className={`h-auto`}
              />
            ) : (
              <div className="container max-w-fit">
                <Swiper
                  modules={[
                    FreeMode,
                    Navigation,
                    Thumbs,
                    Autoplay,
                    EffectFade,
                    Mousewheel,
                  ]}
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
                  className="relative"
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
                    .slice(0, 5)
                    .reverse()
                    .map((vid, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <iframe
                            src={`https://youtube.com/embed/${vid.key}?rel=0&start=0`}
                            title="YouTube video player"
                            loading="lazy"
                            frameBorder="0"
                            allowFullScreen
                            className={`w-full h-full aspect-video rounded-lg`}
                          ></iframe>
                        </SwiperSlide>
                      );
                    })}

                  {movie.images &&
                    movie.images.backdrops.slice(0, 5).map((img, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <figure className="rounded-lg overflow-hidden">
                            <img
                              loading="lazy"
                              src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                              alt={``}
                            />
                          </figure>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            )}
          </div>
        ) : (
          ``
        )}
        {movie.reviews && movie.reviews.results.length !== 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center justify-between bg-base-dark-gray sticky top-[4.125rem] py-2 bg-opacity-90 backdrop-blur-sm z-10">
              {loading ? (
                <Loading height="[30px] max-w-[100px]" className={`h-[30px]`} />
              ) : (
                <h2 className="font-bold text-2xl text-white m-0">Reviews</h2>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {movie.reviews &&
                movie.reviews.results &&
                movie.reviews.results
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
