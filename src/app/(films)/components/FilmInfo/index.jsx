/* eslint-disable @next/next/no-img-element */
"use client";

// React imports
import React, { useCallback, useEffect, useState } from "react";

// Ionic React icons
import { IonIcon } from "@ionic/react";
import {
  arrowRedoOutline,
  calendarOutline,
  star,
  timeOutline,
  tvOutline,
} from "ionicons/icons";

import TitleLogo from "@/components/Film/TitleLogo";
import { usePathname, useRouter } from "next/navigation";
import Person from "../Person";
import Link from "next/link";
import EpisodeCard from "../EpisodeCard";
import { formatRuntime } from "@/lib/formatRuntime";
import { formatDate } from "@/lib/formatDate";
import { isPlural } from "@/lib/isPlural";
import Reveal from "@/components/Layout/Reveal";
import moment from "moment";
import { formatRating } from "@/lib/formatRating";
import WatchlistButton from "../User/WatchlistButton";
import FavoriteButton from "../User/FavoriteButton";
import { useAuth } from "@/hooks/auth";
import { useCookies } from "next-client-cookies";
import { QueryData, fetchData } from "@/lib/fetch";
import axios from "axios";
import { delay } from "@/lib/delay";
import UserRating from "../User/UserRating";
import ProductionCompany from "./ProductionCompany";
import FilmReleaseDate from "./FilmReleaseDate";
import FilmDirector from "./FilmDirector";
import WatchProvider from "./WatchProvider";
import Countdown from "./Countdown";
import LastEpisode from "./tv/LastEpisode";
import NextEpisode from "./tv/NextEpisode";

export default function FilmInfo({
  film,
  images,
  credits,
  providers,
  setLoading,
  releaseDates,
}) {
  const [URL, setURL] = useState("");
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
  const filmReleaseDate = releaseDateByCountry
    ? releaseDateByCountry.release_dates[0].release_date
    : film.release_date;

  const isUpcoming =
    new Date(!isTvPage ? filmReleaseDate : nextEps?.air_date) > new Date();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Shared via Popcorn Vision",
        // text: "Check out this amazing film!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  let director = credits.crew.find((person) => person.job === "Director");
  const filmRuntime = !isTvPage
    ? film.runtime
    : film.episode_run_time.length > 0 && film.episode_run_time[0];

  // Use Effect for getting user location
  useEffect(() => {
    setUserLocation(localStorage.getItem("user-location"));
  }, []);

  // Get account state
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
        .finally(() => setIsLoading(false));
    },
    [film, isTvPage],
  );

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
                      })}`}

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
          <FilmDirector
            film={film}
            credits={credits}
            director={director}
            isTvPage={isTvPage}
          />

          {/* Film Watch Provider */}
          <WatchProvider
            providers={providers}
            userLocation={userLocation}
            isTvPage={isTvPage}
          />

          {/* NOTE: Coba ambil dari user, kayak episode yg saat ini ditonton */}

          {/* Countdown */}
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

            {isUpcoming && (
              <Countdown
                isTvPage={isTvPage}
                filmReleaseDate={filmReleaseDate}
                nextEps={nextEps}
                film={film}
              />
            )}
          </section>

          {/* User Rating */}
          {user && !isUpcoming && (
            <Reveal className={`mt-2`}>
              <section id={`User Rating`} className={`max-w-fit`}>
                <UserRating film={film} getAccountStates={getAccountStates} />
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
                <Reveal className={`flex`}>
                  <FavoriteButton
                    film={film}
                    getAccountStates={getAccountStates}
                  />
                </Reveal>

                {/* Add to Watchlist */}
                <Reveal className={`flex`}>
                  <WatchlistButton
                    film={film}
                    getAccountStates={getAccountStates}
                  />
                </Reveal>
              </div>
            )}

            {/* Share */}
            <div className={`relative ml-auto gap-4 sm:gap-0`}>
              <Reveal className={`sm:hidden`}>
                <button
                  onClick={handleShare}
                  className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
                >
                  <IonIcon icon={arrowRedoOutline} />
                  <span>Share</span>
                </button>
              </Reveal>

              <Reveal className={`hidden sm:flex`}>
                <button
                  className={`btn btn-ghost mt-2 flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm hocus:bg-opacity-10`}
                  onClick={() =>
                    document.getElementById("shareModal").showModal()
                  }
                >
                  <IonIcon icon={arrowRedoOutline} />
                  <span>Share</span>
                </button>
              </Reveal>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
