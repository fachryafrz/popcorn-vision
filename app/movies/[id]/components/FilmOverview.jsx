/* eslint-disable @next/next/no-img-element */
"use client";

import TitleLogo from "@/app/components/TitleLogo";
import React from "react";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";
import FilmMedia from "./FilmMedia";
import FilmCollection from "./FilmCollection";
import FilmReviews from "./FilmReviews";
import { usePathname } from "next/navigation";

export default function FilmOverview({
  film,
  videos,
  images,
  reviews,
  credits,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  // Release Date
  const dateStr = isItTvPage(film.release_date, film.first_air_date);
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  return (
    <div className="flex flex-col gap-6 self-start w-full">
      <div className="flex gap-4 flex-col items-center sm:items-stretch sm:flex-row lg:gap-0">
        <div className="flex flex-col gap-1">
          <div className="sticky top-20 flex flex-col gap-1">
            <figure className="w-[50vw] sm:w-[25vw] lg:hidden aspect-poster rounded-lg overflow-hidden self-start shadow-xl">
              <div
                className={
                  film.poster_path === null
                    ? `w-full h-full bg-base-dark-gray`
                    : `hidden`
                }
              >
                <img
                  loading="lazy"
                  src={`/popcorn.png`}
                  alt={process.env.APP_NAME}
                  className="object-contain"
                />
              </div>

              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                alt={isItTvPage(film.title, film.name)}
                className={film.poster_path === null ? `hidden` : `block`}
              />
            </figure>
          </div>
        </div>
        <div className="flex flex-col items-center md:justify-center sm:items-start gap-2 sm:gap-0 w-full">
          {images.logos.length > 0 ? (
            <TitleLogo film={film.id} isItTvPage={isItTvPage} />
          ) : (
            <h1
              title={isItTvPage(film.title, film.name)}
              className="max-w-fit font-bold text-2xl lg:text-5xl line-clamp-2 md:line-clamp-3 md:py-2 !leading-tight"
            >
              {isItTvPage(film.title, film.name)}
            </h1>
          )}

          <table className="w-full md:max-w-fit text-sm lg:text-base first:[&_td]:pr-2 sm:first:[&_td]:pr-6 first:[&_td]:align-top [&_td]:leading-relaxed first:[&_td]:whitespace-nowrap">
            <tbody>
              {film.production_companies &&
                film.production_companies.length > 0 && (
                  <tr>
                    <td className="text-gray-400 whitespace-nowrap">
                      Produced by
                    </td>
                    <td className={` line-clamp-1`}>
                      {film.production_companies
                        .map((item) => item.name)
                        .join(", ")}
                    </td>
                  </tr>
                )}

              {film.release_date || film.first_air_date ? (
                <tr>
                  <td className="text-gray-400">
                    {!isTvPage ? `Release Date` : `Air Date`}
                  </td>
                  {!isTvPage ? (
                    <td>{formattedDate}</td>
                  ) : (
                    <td>
                      {formattedDate}{" "}
                      {film.last_air_date !== null &&
                      film.last_air_date !== film.first_air_date ? (
                        <span className="hidden xs:inline">
                          {`- ${new Date(film.last_air_date).toLocaleString(
                            "en-US",
                            options
                          )}`}
                        </span>
                      ) : null}
                    </td>
                  )}
                </tr>
              ) : null}

              {isTvPage &&
                film.number_of_seasons > 0 &&
                film.number_of_episodes > 0 && (
                  <tr>
                    <td className="text-gray-400">Chapter</td>
                    <td className={``}>
                      {`${film.number_of_seasons} Season${
                        film.number_of_seasons > 1 ? `s` : ``
                      }`}{" "}
                      {`(${film.number_of_episodes} Episode${
                        film.number_of_episodes > 1 ? `s` : ``
                      })`}
                    </td>
                  </tr>
                )}

              {film.genres && film.genres.length > 0 && (
                <tr>
                  <td className="text-gray-400">Genre</td>

                  <td>{film.genres.map((item) => item.name).join(", ")}</td>
                </tr>
              )}

              {!isTvPage
                ? film.runtime > 0 && (
                    <tr>
                      <td className="text-gray-400">Runtime</td>

                      {Math.floor(film.runtime / 60) >= 1 ? (
                        <td>
                          {Math.floor(film.runtime / 60)}h {film.runtime % 60}m
                        </td>
                      ) : (
                        <td>
                          {film.runtime % 60} minute
                          {film.runtime % 60 > 1 && `s`}
                        </td>
                      )}
                    </tr>
                  )
                : film.episode_run_time.length > 0 && (
                    <tr>
                      <td className="text-gray-400">Runtime</td>

                      {Math.floor(film.episode_run_time[0] / 60) >= 1 ? (
                        <td>
                          {Math.floor(film.episode_run_time[0] / 60)}h{" "}
                          {film.episode_run_time[0] % 60}m
                        </td>
                      ) : (
                        <td>
                          {film.episode_run_time[0] % 60} minute
                          {film.episode_run_time[0] % 60 > 1 && `s`}
                        </td>
                      )}
                    </tr>
                  )}

              {!isTvPage
                ? credits &&
                  credits.crew.length > 0 &&
                  credits.crew.find((person) => person.job === "Director") && (
                    <tr>
                      <td className="text-gray-400 whitespace-nowrap">
                        Directed by
                      </td>
                      <td className={`flex items-center gap-2`}>
                        {credits.crew.find(
                          (person) => person.job === "Director"
                        ).profile_path === null ? (
                          <img
                            src={`/popcorn.png`}
                            alt={
                              credits.crew.find(
                                (person) => person.job === "Director"
                              ).name
                            }
                            className={`aspect-square w-[40px] rounded-full object-contain`}
                          />
                        ) : (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${
                              credits.crew.find(
                                (person) => person.job === "Director"
                              ).profile_path
                            }`}
                            alt={
                              credits.crew.find(
                                (person) => person.job === "Director"
                              ).name
                            }
                            className={`aspect-square w-[40px] rounded-full`}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="">
                            {
                              credits.crew.find(
                                (person) => person.job === "Director"
                              ).name
                            }
                          </span>
                          <span className="text-sm text-gray-400 ">
                            {credits.crew.find(
                              (person) => person.job === "Director"
                            ).gender === 0
                              ? `Not Specified`
                              : credits.crew.find(
                                  (person) => person.job === "Director"
                                ).gender === 1
                              ? `Female`
                              : credits.crew.find(
                                  (person) => person.job === "Director"
                                ).gender === 2
                              ? `Male`
                              : ``}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                : film.created_by.length > 0 && (
                    <tr>
                      <td className="text-gray-400 whitespace-nowrap">
                        Directed by
                      </td>
                      <td
                        className={`flex flex-col flex-wrap sm:flex-row items-start sm:items-center gap-2`}
                      >
                        {film.created_by.map((item, index) => {
                          const gender =
                            item.gender === 0
                              ? `Not Specified`
                              : item.gender === 1
                              ? `Female`
                              : item.gender === 2
                              ? `Male`
                              : ``;

                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-2`}
                            >
                              {item.profile_path === null ? (
                                <img
                                  src={`/popcorn.png`}
                                  alt={item.name}
                                  className={`aspect-square w-[40px] rounded-full object-contain`}
                                />
                              ) : (
                                <img
                                  src={`https://image.tmdb.org/t/p/w185${item.profile_path}`}
                                  alt={item.name}
                                  className={`aspect-square w-[40px] rounded-full`}
                                />
                              )}
                              <div className={`flex flex-col`}>
                                <span className="">{item.name}</span>
                                {item.gender < 3 && (
                                  <span className="text-sm text-gray-400 ">
                                    {gender}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-white flex flex-col gap-6">
        {film.overview && (
          <div id="overview" className="flex flex-col gap-2 ">
            <h2 className="font-bold text-xl text-white m-0">Overview</h2>

            <p className="text-gray-400 md:text-lg">{film.overview}</p>
          </div>
        )}

        {videos.results.length > 0 && images.backdrops.length > 0 && (
          <FilmMedia videos={videos} images={images.backdrops} />
        )}

        {!isTvPage && film.belongs_to_collection !== null && (
          <FilmCollection film={film} />
        )}

        {reviews.results.length > 0 && (
          <FilmReviews reviews={reviews} film={film} />
        )}
      </div>
    </div>
  );
}
