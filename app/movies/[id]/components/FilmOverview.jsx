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

export default function FilmOverview({ film, logo, videos, images }) {
  // Release Date
  const dateStr = film.release_date;
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
                alt={film.title}
                className={film.poster_path === null ? `hidden` : `block`}
              />
            </figure>
            {/* <button
            onClick={handleGoBack}
            className="flex gap-2 text-xs sm:text-sm items-center justify-center bg-base-gray bg-opacity-10 py-2 rounded-lg hocus:bg-opacity-30 active:bg-opacity-50 md:hidden"
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
          {images.logos.length > 0 ? (
            <TitleLogo film={film.id} />
          ) : (
            <h1
              title={film.title}
              className="max-w-fit font-bold text-2xl lg:text-5xl line-clamp-2 md:line-clamp-3 md:py-2 !leading-tight"
            >
              {film.title}
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
                  <td className="text-gray-400">{`Release Date`}</td>

                  <td>{formattedDate}</td>
                </tr>
              ) : null}

              {/* TV Page Only */}
              {/* <tr>
                  <td className="text-gray-400">Chapter</td>
                  <td className={``}>
                    {`${film.number_of_seasons} Season${
                      film.number_of_seasons > 1 ? `s` : ``
                    }`}{" "}
                    {`(${film.number_of_episodes} Episode${
                      film.number_of_episodes > 1 ? `s` : ``
                    })`}
                  </td>
                </tr> */}

              {film.genres && film.genres.length > 0 && (
                <tr>
                  <td className="text-gray-400">Genre</td>
                  {/* <td className="flex gap-1 flex-wrap">
                  {film.genres &&
                    film.genres.map((genre) => {
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
                    {film.genres.map((item) => item.name).join(", ")}
                  </td>
                </tr>
              )}

              {film.runtime > 0 && (
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
              )}

              {film.credits &&
                film.credits.crew.length > 0 &&
                film.credits.crew.find(
                  (person) => person.job === "Director"
                ) && (
                  <tr>
                    <td className="text-gray-400 whitespace-nowrap">
                      Directed by
                    </td>
                    <td className={`flex items-center gap-2`}>
                      {film.credits.crew.find(
                        (person) => person.job === "Director"
                      ).profile_path === null ? (
                        <img
                          src={`/popcorn.png`}
                          alt={
                            film.credits.crew.find(
                              (person) => person.job === "Director"
                            ).name
                          }
                          className={`aspect-square w-[40px] rounded-full object-contain`}
                        />
                      ) : (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${
                            film.credits.crew.find(
                              (person) => person.job === "Director"
                            ).profile_path
                          }`}
                          alt={
                            film.credits.crew.find(
                              (person) => person.job === "Director"
                            ).name
                          }
                          className={`aspect-square w-[40px] rounded-full`}
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="">
                          {
                            film.credits.crew.find(
                              (person) => person.job === "Director"
                            ).name
                          }
                        </span>
                        <span className="text-sm text-gray-400 ">
                          {film.credits.crew.find(
                            (person) => person.job === "Director"
                          ).gender === 0
                            ? `Not Specified`
                            : film.credits.crew.find(
                                (person) => person.job === "Director"
                              ).gender === 1
                            ? `Female`
                            : film.credits.crew.find(
                                (person) => person.job === "Director"
                              ).gender === 2
                            ? `Male`
                            : ``}
                        </span>
                      </div>
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

        {film.belongs_to_collection !== null && <FilmCollection film={film} />}

        {/* {reviews && reviews.length !== 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center justify-between bg-base-dark-gray backdrop-blur bg-opacity-[85%] sticky top-[4.125rem] py-2 z-10">
              {loading ? (
                <Loading height="[30px] max-w-[100px]" className={`h-[30px]`} />
              ) : (
                <h2 className="font-bold text-xl text-white m-0">Reviews</h2>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {reviews &&
                reviews.map((review, index) => {
                  return (
                    <FilmReviews
                      key={index}
                      loading={loading}
                      logo={`/popcorn.png`}
                      review={review}
                    />
                  );
                })}
            </div>
            {totalReviewPages > 1 && currentReviewPage !== totalReviewPages && (
              <button
                onClick={() => fetchMoreReviews((currentReviewPage += 1))}
                className="text-primary-blue py-2 flex justify-center hocus:bg-white hocus:bg-opacity-10 rounded-lg"
              >
                Load more reviews
              </button>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
