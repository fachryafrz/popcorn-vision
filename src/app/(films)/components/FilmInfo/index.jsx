/* eslint-disable @next/next/no-img-element */
"use client";

// React imports
import React, { useCallback, useEffect, useState } from "react";

// Ionic React icons
import { IonIcon } from "@ionic/react";
import { timeOutline, tvOutline } from "ionicons/icons";

import TitleLogo from "@/components/Film/TitleLogo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { formatRuntime } from "@/lib/formatRuntime";
import { isPlural } from "@/lib/isPlural";
import Reveal from "@/components/Layout/Reveal";
import WatchlistButton from "../User/WatchlistButton";
import FavoriteButton from "../User/FavoriteButton";
import { useAuth } from "@/hooks/auth";
import axios from "axios";
import UserRating from "../User/UserRating";
import ProductionCompany from "./ProductionCompany";
import FilmReleaseDate from "./FilmReleaseDate";
import FilmDirector from "./FilmDirector";
import WatchProvider from "./WatchProvider";
import Countdown from "./Countdown";
import LastEpisode from "./tv/LastEpisode";
import NextEpisode from "./tv/NextEpisode";
import ShareButton from "./ShareButton";

export default function FilmInfo({
  film,
  images,
  credits,
  providers,
  setLoading,
  releaseDates,
}) {
  const [userLocation, setUserLocation] = useState(null);
  const countryCode = userLocation && JSON.parse(userLocation).countryCode;
  const countryName = userLocation && JSON.parse(userLocation).countryName;

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const { user } = useAuth();

  const nextEps = film.next_episode_to_air;
  const lastEps = film.last_episode_to_air;

  // Release Date
  const releaseDateByCountry = releaseDates?.results.find(
    (item) => item.iso_3166_1 === countryCode,
  );

  const filteredReleaseDateByCountry = releaseDateByCountry?.release_dates
    .filter(
      (item) =>
        item.type === 1 ||
        item.type === 3 ||
        item.type === 2 ||
        item.type === 4 ||
        item.type === 5 ||
        item.type === 6,
    )
    .reduce((earliest, current) => {
      return new Date(current.release_date) < new Date(earliest.release_date)
        ? current
        : earliest;
    });

  const filmReleaseDate = releaseDateByCountry
    ? filteredReleaseDateByCountry?.release_date
    : film.release_date;

  const isUpcoming =
    new Date(!isTvPage ? filmReleaseDate : film.first_air_date) > new Date();
  const isUpcomingNextEps = new Date(nextEps?.air_date) > new Date();

  const filmRuntime = !isTvPage
    ? film.runtime
    : film.episode_run_time.length > 0 && film.episode_run_time[0];

  // Use Effect for getting user location
  useEffect(() => {
    setUserLocation(localStorage.getItem("user-location"));
  }, []);

  // Get account state
  const [accountStates, setAccountStates] = useState();

  const getAccountStates = useCallback(
    async ({ setValue, setHoverValue, setIsLoading, type }) => {
      await axios
        .get(`/api/account_states`, {
          params: {
            id: film.id,
            type: !isTvPage ? `movie` : `tv`,
          },
        })
        .then(({ data: res }) => {
          switch (type) {
            case "favorite":
              setValue(res.favorite);
              break;
            case "watchlist":
              setValue(res.watchlist);
              break;
            case "rating":
              setValue(res.rated);
              setHoverValue(res.rated);
              break;
            default:
              setValue(res);
              break;
          }
        })
        .catch((error) => {
          console.error("Error getting account states:", error);
        })
        .finally(() => {
          if (setIsLoading) {
            setIsLoading(false);
          }
        });
    },
    [film, isTvPage],
  );

  useEffect(() => {
    getAccountStates({
      setValue: setAccountStates,
    });
  }, [getAccountStates]);

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-stretch lg:gap-0">
      <div className="flex w-full flex-col items-center gap-4 md:items-start md:justify-center">
        {/* Film Title Logo */}
        {images.logos.length > 0 ? (
          <TitleLogo
            film={film}
            images={images.logos.find((img) => img.iso_639_1 === "en")}
          />
        ) : (
          <Reveal>
            <h1
              title={!isTvPage ? film.title : film.name}
              className="line-clamp-3 max-w-fit text-center text-3xl font-bold !leading-normal md:text-start md:text-5xl"
              style={{ textWrap: `balance` }}
            >
              {!isTvPage ? film.title : film.name}
            </h1>
          </Reveal>
        )}

        <div
          className={`flex w-full flex-col gap-4 text-sm md:gap-2 lg:text-base`}
        >
          {/* Film Production Company */}
          {film.production_companies?.length > 0 &&
            film.production_companies.find(
              (company) => company.logo_path !== null,
            ) && (
              <section
                id={`Production Companies`}
                className={`flex flex-wrap justify-center gap-4 md:mb-4 md:justify-start`}
              >
                {film.production_companies.map(
                  (item, i) =>
                    item.logo_path !== null && (
                      <div key={item.id}>
                        <ProductionCompany
                          item={item}
                          i={i}
                          isTvPage={isTvPage}
                        />
                      </div>
                    ),
                )}
              </section>
            )}

          {/* Film Release Date */}
          <FilmReleaseDate
            film={film}
            isTvPage={isTvPage}
            countryName={countryName}
            filmReleaseDate={filmReleaseDate}
            releaseDateByCountry={releaseDateByCountry}
          />

          {/* TV Series Number of Season */}
          {isTvPage &&
            film.number_of_seasons > 0 &&
            film.number_of_episodes > 0 && (
              <section id={`TV Series Chapter`}>
                <Reveal>
                  <div className={`flex items-center gap-1`}>
                    <IonIcon icon={tvOutline} />

                    <span>
                      {`${film.number_of_seasons} ${isPlural({
                        text: "Season",
                        number: film.number_of_seasons,
                      })}`}{" "}
                      {`(${film.number_of_episodes} ${isPlural({
                        text: "Episode",
                        number: film.number_of_episodes,
                      })})`}
                    </span>
                  </div>
                </Reveal>
              </section>
            )}

          {/* Film Runtime */}
          {filmRuntime > 0 && (
            <section id={`Movie Runtime`}>
              <Reveal>
                <div className={`flex items-center gap-1`}>
                  <IonIcon icon={timeOutline} />
                  <time>
                    {`${filmRuntime} ${isPlural({ text: "minute", number: filmRuntime % 60 })}`}
                  </time>
                  {Math.floor(filmRuntime / 60) >= 1 && (
                    <span>{`(${formatRuntime(filmRuntime)})`}</span>
                  )}
                </div>
              </Reveal>
            </section>
          )}

          {/* Film Genres */}
          {film.genres && film.genres.length > 0 && (
            <section id={`Film Genres`} className={`flex flex-wrap gap-1`}>
              {film.genres.map((item, i) => {
                return (
                  <Reveal delay={0.2 * i} key={item.id}>
                    <Link
                      href={
                        !isTvPage
                          ? `/search?with_genres=${item.id}`
                          : `/tv/search?with_genres=${item.id}`
                      }
                      className={`btn btn-ghost rounded-full bg-secondary bg-opacity-20 backdrop-blur`}
                    >
                      {item.name}
                    </Link>
                  </Reveal>
                );
              })}
            </section>
          )}

          {/* Film Director / Creator */}
          <FilmDirector film={film} credits={credits} isTvPage={isTvPage} />

          {/* Film Watch Provider */}
          <WatchProvider
            providers={providers}
            userLocation={userLocation}
            isTvPage={isTvPage}
          />

          {/* NOTE: Coba ambil dari user, kayak episode yg saat ini ditonton */}

          {/* Countdown */}
          {filmReleaseDate !== "" && (
            <section
              id={`Countdown`}
              className={`mt-2 grid gap-2 xl:grid-cols-2`}
            >
              {lastEps && nextEps && (
                <div
                  id={`TV Series Last Episode`}
                  className={`flex flex-col gap-2`}
                >
                  <Reveal>
                    <LastEpisode
                      film={film}
                      lastEps={lastEps}
                      nextEps={nextEps}
                      setLoading={setLoading}
                    />
                  </Reveal>
                </div>
              )}

              {nextEps && (
                <div
                  id={`TV Series Next Episode`}
                  className={`flex flex-col gap-2`}
                >
                  <Reveal>
                    <NextEpisode
                      film={film}
                      nextEps={nextEps}
                      setLoading={setLoading}
                    />
                  </Reveal>
                </div>
              )}

              {(isUpcoming || isUpcomingNextEps) && (
                <div
                  className={`xl:row-[2/3] ${isTvPage && nextEps.episode_number > 1 ? `xl:col-[2/3]` : `xl:col-[1/3]`}`}
                >
                  <Countdown
                    isTvPage={isTvPage}
                    filmReleaseDate={filmReleaseDate}
                    nextEps={nextEps}
                    film={film}
                  />
                </div>
              )}
            </section>
          )}

          {/* User Rating */}
          {user && !isUpcoming && filmReleaseDate !== "" && (
            <Reveal className={`mt-2`}>
              <section id={`User Rating`} className={`max-w-fit`}>
                <UserRating
                  film={film}
                  getAccountStates={getAccountStates}
                  rating={accountStates?.rated}
                />
              </section>
            </Reveal>
          )}

          {/* Call to Action */}
          <section
            id={`Share`}
            className={`mt-2 flex flex-wrap items-end gap-1`}
          >
            {user && (
              <div className={`flex flex-col gap-1 md:flex-row`}>
                {/* Add to Favorite */}
                {!isUpcoming && filmReleaseDate !== "" && (
                  <Reveal className={`flex`}>
                    <FavoriteButton
                      film={film}
                      getAccountStates={getAccountStates}
                      favorite={accountStates?.favorite}
                    />
                  </Reveal>
                )}

                {/* Add to Watchlist */}
                <Reveal className={`flex`}>
                  <WatchlistButton
                    film={film}
                    getAccountStates={getAccountStates}
                    watchlist={accountStates?.watchlist}
                  />
                </Reveal>
              </div>
            )}

            {/* Share */}
            <Reveal className={`relative ml-auto gap-4 sm:gap-0`}>
              <ShareButton />
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
