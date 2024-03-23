/* eslint-disable @next/next/no-img-element */
"use client";

// React imports
import React, { useEffect, useState } from "react";

// Ionic React icons
import { IonIcon } from "@ionic/react";
import {
  addOutline,
  arrowRedoOutline,
  calendarOutline,
  star,
  starOutline,
  timeOutline,
  tvOutline,
} from "ionicons/icons";

import TitleLogo from "@/components/Film/TitleLogo";
import { usePathname, useRouter } from "next/navigation";
import Person from "./Person";
import Link from "next/link";
import EpisodeCard from "./EpisodeCard";
import { formatRuntime } from "@/lib/formatRuntime";
import { formatDate } from "@/lib/formatDate";
import { isPlural } from "@/lib/isPlural";
import Reveal from "@/components/Layout/Reveal";
import moment from "moment";
import { formatRating } from "@/lib/formatRating";
import WatchlistButton from "./User/WatchlistButton";
import FavoriteButton from "./User/FavoriteButton";
import { useAuth } from "@/hooks/auth";
import { fetchData } from "@/lib/fetch";
import { useCookies } from "next-client-cookies";

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

  const router = useRouter();
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const { user } = useAuth();

  const nextEps = film.next_episode_to_air;
  const lastEps = film.last_episode_to_air;

  let providersArray = Object.entries(providers.results);
  let providersIDArray =
    userLocation &&
    providersArray.find(
      (item) => item[0] === JSON.parse(userLocation).countryCode,
    );

  // Release Date
  const releaseDateByCountry = releaseDates?.results.find(
    (item) => item.iso_3166_1 === countryCode,
  );
  const filmReleaseDate = releaseDateByCountry
    ? releaseDateByCountry.release_dates[0].release_date
    : film.release_date;

  const dateStr = !isTvPage ? filmReleaseDate : film.first_air_date;
  const date = new Date(dateStr);

  const isUpcoming =
    new Date(!isTvPage ? filmReleaseDate : nextEps?.air_date) > new Date();
  const upcomingDate = !isTvPage ? filmReleaseDate : nextEps?.air_date;

  const timeLeft = new Date(new Date(upcomingDate) - new Date());

  const duration = moment.duration(timeLeft);
  const yearsLeft = duration.years();
  const monthsLeft = duration.months();
  const daysLeft = duration.days();
  const hoursLeft = duration.hours();
  const minutesLeft = duration.minutes();
  const secondsLeft = duration.seconds();

  const [countdown, setCountdown] = useState({
    years: yearsLeft,
    months: monthsLeft,
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  });

  const calculateCountdown = (timeLeft) => {
    return {
      years: yearsLeft,
      months: monthsLeft,
      days: daysLeft,
      hours: hoursLeft,
      minutes: minutesLeft,
      seconds: secondsLeft,
    };
  };

  useEffect(() => {
    setURL(window.location.href);

    const interval = setInterval(() => {
      setCountdown(calculateCountdown(timeLeft));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Shared via Popcorn Vision",
        // text: "Check out this amazing film!",
        url: URL,
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
          {film.production_companies &&
            film.production_companies.length > 0 &&
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
                        <Link
                          href={
                            !isTvPage
                              ? `/search?with_companies=${item.id}`
                              : `/tv/search?with_companies=${item.id}`
                          }
                        >
                          <Reveal delay={0.2 * i}>
                            <figure
                              title={item.name}
                              className={`aspect-[4/2] h-[50px] bg-center grayscale invert transition-all hocus:grayscale-0 hocus:invert-0`}
                              style={{
                                backgroundImage: `url(https://image.tmdb.org/t/p/w500${item.logo_path})`,
                                backgroundSize: `contain`,
                                backgroundRepeat: `no-repeat`,
                              }}
                            ></figure>
                          </Reveal>
                        </Link>
                        <span className={`sr-only`}>{item.name}</span>
                      </div>
                    ),
                )}
              </section>
            )}

          {/* Film Release Date */}
          {!isTvPage
            ? filmReleaseDate && (
                <section id={`Movie Release Date`}>
                  <Reveal>
                    <div className={`flex items-center gap-2`}>
                      <IonIcon icon={calendarOutline} />

                      <time dateTime={filmReleaseDate}>
                        {formatDate({ date: filmReleaseDate })}
                      </time>

                      {releaseDateByCountry && (
                        <span>{`(${countryName})`}</span>
                      )}
                    </div>
                  </Reveal>
                </section>
              )
            : film.first_air_date && (
                <section id={`TV Series Air Date`}>
                  <Reveal>
                    <div className={`flex items-center gap-2`}>
                      <IonIcon icon={calendarOutline} />

                      <time dateTime={film.first_air_date}>
                        {formatDate({ date: film.first_air_date })}{" "}
                        {film.last_air_date !== null &&
                          film.last_air_date !== film.first_air_date && (
                            <span className="hidden xs:inline">
                              {`- ${formatDate({ date: film.last_air_date })}`}
                            </span>
                          )}
                      </time>
                    </div>
                  </Reveal>
                </section>
              )}

          {/* TV Series Number of Season */}
          {isTvPage &&
            film.number_of_seasons > 0 &&
            film.number_of_episodes > 0 && (
              <section id={`TV Series Chapter`}>
                <Reveal>
                  <div className={`flex items-center gap-2`}>
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
                  </div>{" "}
                </Reveal>
              </section>
            )}

          {/* Film Runtime */}
          {filmRuntime > 0 && (
            <section id={`Movie Runtime`}>
              <Reveal>
                <div className={`flex items-center gap-2`}>
                  <IonIcon icon={timeOutline} />
                  <time>
                    {filmRuntime}{" "}
                    {isPlural({ text: "minute", number: filmRuntime % 60 })}
                  </time>
                  {Math.floor(filmRuntime / 60) >= 1 && (
                    <span>{`(${formatRuntime(filmRuntime)})`}</span>
                  )}
                </div>{" "}
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
                    </Link>{" "}
                  </Reveal>
                );
              })}
            </section>
          )}

          {/* Film Director / Creator */}
          {!isTvPage
            ? credits &&
              credits.crew.length > 0 &&
              director && (
                <section
                  id={`Movie Director`}
                  className={`flex items-center gap-2`}
                >
                  <Reveal>
                    <Person
                      id={director.id}
                      name={director.name}
                      profile_path={
                        director.profile_path === null
                          ? null
                          : `https://image.tmdb.org/t/p/w185${director.profile_path}`
                      }
                      role={`Director`}
                    />{" "}
                  </Reveal>
                </section>
              )
            : film.created_by.length > 0 && (
                <section
                  id={`TV Series Creator`}
                  className={`flex flex-wrap items-center`}
                >
                  {film.created_by.map((item, i) => {
                    return (
                      <Reveal key={item.id}>
                        <Person
                          id={item.id}
                          name={item.name}
                          profile_path={
                            item.profile_path === null
                              ? null
                              : `https://image.tmdb.org/t/p/w185${item.profile_path}`
                          }
                          role={`Creator`}
                        />{" "}
                      </Reveal>
                    );
                  })}
                </section>
              )}

          {/* Film Watch Provider */}
          {providers.results && providersIDArray ? (
            <section
              id={`Film Providers`}
              className="flex flex-col justify-center gap-1 md:justify-start"
            >
              <Reveal>
                <span className={`text-sm italic text-gray-400`}>
                  Where to watch?
                </span>{" "}
              </Reveal>
              <div className={`flex flex-wrap gap-2`}>
                {(
                  providersIDArray[1].rent ||
                  providersIDArray[1].buy ||
                  providersIDArray[1].flatrate ||
                  providersIDArray[1].ads
                ).map(
                  (item, i) =>
                    item.logo_path !== null && (
                      <Reveal delay={0.2 * i} key={item.provider_id}>
                        <Link
                          href={`${
                            !isTvPage ? `/search` : `/tv/search`
                          }?watch_providers=${item.provider_id}`}
                        >
                          <figure
                            title={item.provider_name}
                            style={{
                              background: `url(https://image.tmdb.org/t/p/w500${item.logo_path})`,
                              backgroundSize: `contain`,
                              backgroundRepeat: `no-repeat`,
                            }}
                            className={`aspect-square w-[40px] rounded-xl`}
                          ></figure>
                        </Link>{" "}
                      </Reveal>
                    ),
                )}
              </div>
            </section>
          ) : userLocation ? (
            providersIDArray && (
              <Reveal>
                <section id={`Film Providers`}>
                  <span className={`text-sm italic text-gray-400`}>
                    Where to watch? <br /> Hold on we&apos;re still finding...
                  </span>
                </section>{" "}
              </Reveal>
            )
          ) : (
            <Reveal>
              <section id={`Film Providers`}>
                <span className={`text-sm italic text-gray-400`}>
                  Where to watch? <br /> Please enable location services to find
                  out where to watch this film.
                </span>
              </section>{" "}
            </Reveal>
          )}

          {/* TV Series Episode */}
          <section
            id={`TV Series Episode`}
            className={`mt-2 grid gap-2 xl:grid-cols-2`}
          >
            {lastEps && (
              <div
                id={`TV Series Last Episode`}
                className={`flex flex-col gap-2`}
              >
                <Reveal>
                  <EpisodeCard
                    className={`w-full`}
                    filmID={film.id}
                    setLoading={setLoading}
                    episode={lastEps}
                    imgPath={lastEps.still_path}
                    title={lastEps.name}
                    overlay={
                      nextEps
                        ? `Latest Episode: ${lastEps.episode_number}`
                        : `Last Episode: ${lastEps.episode_number}`
                    }
                    secondaryInfo={`Season ${lastEps.season_number}`}
                    thirdInfo={
                      <>
                        {lastEps.vote_average > 1 && (
                          <span
                            className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            <IonIcon
                              icon={star}
                              className={`text-primary-yellow`}
                            />
                            {formatRating(lastEps.vote_average)}
                          </span>
                        )}

                        {lastEps.runtime && (
                          <span
                            className={`flex rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            {Math.floor(lastEps.runtime / 60) >= 1
                              ? `${Math.floor(
                                  lastEps.runtime / 60,
                                )}h ${Math.floor(lastEps.runtime % 60)}m`
                              : `${lastEps.runtime} ${isPlural({
                                  text: "minute",
                                  number: lastEps.runtime % 60,
                                })}`}
                          </span>
                        )}

                        {lastEps.air_date && (
                          <span
                            className={`rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            {formatDate({
                              date: lastEps.air_date,
                              showDay: false,
                            })}
                          </span>
                        )}
                      </>
                    }
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
                  <EpisodeCard
                    className={`w-full`}
                    filmID={film.id}
                    setLoading={setLoading}
                    episode={nextEps}
                    imgPath={nextEps.still_path}
                    title={nextEps.name}
                    overlay={
                      nextEps.episode_type == `finale`
                        ? `Final Episode: ${nextEps.episode_number}`
                        : nextEps.episode_number == 1
                          ? `First Episode`
                          : `Next Episode: ${nextEps.episode_number}`
                    }
                    secondaryInfo={`Season ${nextEps.season_number}`}
                    thirdInfo={
                      <>
                        {nextEps.vote_average > 1 && (
                          <span
                            className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            <IonIcon
                              icon={star}
                              className={`text-primary-yellow`}
                            />
                            {formatRating(nextEps.vote_average)}
                          </span>
                        )}

                        {nextEps.runtime && (
                          <span
                            className={`flex rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            {Math.floor(nextEps.runtime / 60) >= 1
                              ? `${Math.floor(
                                  nextEps.runtime / 60,
                                )}h ${Math.floor(nextEps.runtime % 60)}m`
                              : `${nextEps.runtime} ${isPlural({
                                  text: "minute",
                                  number: nextEps.runtime % 60,
                                })}`}
                          </span>
                        )}

                        {nextEps.air_date && (
                          <span
                            className={`flex rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            {formatDate({
                              date: nextEps.air_date,
                              showDay: false,
                            })}
                          </span>
                        )}
                      </>
                    }
                  />
                </Reveal>
              </div>
            )}

            {isUpcoming && (
              <div className="col-span-full flex flex-wrap justify-start gap-2 text-center">
                {countdown.years > 0 && (
                  <Reveal>
                    <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
                      <span className="countdown font-mono text-4xl sm:text-5xl">
                        <span style={{ "--value": countdown.years }}></span>
                      </span>
                      {isPlural({ text: "year", number: countdown.years })}
                    </div>
                  </Reveal>
                )}
                {countdown.months > 0 && (
                  <Reveal delay={0.1}>
                    <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
                      <span className="countdown font-mono text-4xl sm:text-5xl">
                        <span style={{ "--value": countdown.months }}></span>
                      </span>
                      {isPlural({ text: "month", number: countdown.months })}
                    </div>
                  </Reveal>
                )}
                {countdown.days > 0 && (
                  <Reveal delay={0.2}>
                    {" "}
                    <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
                      <span className="countdown font-mono text-4xl sm:text-5xl">
                        <span style={{ "--value": countdown.days }}></span>
                      </span>
                      {isPlural({ text: "day", number: countdown.days })}
                    </div>
                  </Reveal>
                )}
                <Reveal delay={0.3}>
                  <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
                    <span className="countdown font-mono text-4xl sm:text-5xl">
                      <span style={{ "--value": countdown.hours }}></span>
                    </span>
                    {isPlural({ text: "hour", number: countdown.hours })}
                  </div>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
                    <span className="countdown font-mono text-4xl sm:text-5xl">
                      <span style={{ "--value": countdown.minutes }}></span>
                    </span>
                    min
                  </div>
                </Reveal>
                <Reveal delay={0.5}>
                  <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
                    <span className="countdown font-mono text-4xl sm:text-5xl">
                      <span style={{ "--value": countdown.seconds }}></span>
                    </span>
                    sec
                  </div>
                </Reveal>
              </div>
            )}
          </section>

          {/* Call to Action */}
          <section
            id={`Share`}
            className={`mt-2 flex flex-wrap items-end gap-1`}
          >
            {user && (
              <div className={`flex flex-col gap-1 md:flex-row`}>
                {/* Add to Favorite */}
                <Reveal>
                  <FavoriteButton film={film} />
                </Reveal>

                {/* Add to Watchlist */}
                <Reveal>
                  <WatchlistButton film={film} />
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
