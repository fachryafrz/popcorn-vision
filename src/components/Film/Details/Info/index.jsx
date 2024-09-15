/* eslint-disable @next/next/no-img-element */
"use client";

// React imports
import { useEffect, useState } from "react";

// Ionic React icons
import { IonIcon } from "@ionic/react";
import { timeOutline, tvOutline } from "ionicons/icons";

import TitleLogo from "@/components/Film/TitleLogo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { formatRuntime } from "@/lib/formatRuntime";
import { isPlural } from "@/lib/isPlural";
import Reveal from "@/components/Layout/Reveal";
import WatchlistButton from "../../../User/Actions/WatchlistButton";
import FavoriteButton from "../../../User/Actions/FavoriteButton";
import { useAuth } from "@/hooks/auth";
import axios from "axios";
import UserRating from "../../../User/Actions/UserRating";
import ProductionCompany from "./ProductionCompany";
import FilmReleaseDate from "./FilmReleaseDate";
import FilmDirector from "./FilmDirector";
import WatchProvider from "./WatchProvider";
import Countdown from "./Countdown";
import ShareButton from "./ShareButton";
import LastEpisode from "../TV/LastEpisode";
import NextEpisode from "../TV/NextEpisode";
import { checkLocationPermission, requestLocation } from "@/lib/navigator";
import Confetti from "react-confetti-boom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { USER_LOCATION } from "@/lib/constants";
import moment from "moment";

export default function FilmInfo({
  film,
  images,
  credits,
  providers,
  releaseDates,
}) {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [accountStates, setAccountStates] = useState();

  const parsedUserLocation = location && JSON.parse(location);
  const countryCode = parsedUserLocation?.countryCode;
  const countryName = parsedUserLocation?.countryName;

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const { user } = useAuth();

  const nextEps = film.next_episode_to_air;
  const lastEps = film.last_episode_to_air;

  // Release Date
  const releaseDateByCountry = releaseDates?.results.find(
    (item) => item.iso_3166_1 === countryCode,
  );

  const validTypes = [1, 2, 3, 4, 5, 6];
  const filteredReleaseDateByCountry = releaseDateByCountry?.release_dates
    .filter((item) => validTypes.includes(item.type))
    .reduce((earliest, current) => {
      return moment(current.release_date).isBefore(earliest.release_date)
        ? current
        : earliest;
    });

  const filmReleaseDate = releaseDateByCountry
    ? filteredReleaseDateByCountry?.release_date
    : film?.release_date;

  const isUpcoming = moment(
    !isTvPage ? filmReleaseDate : film?.first_air_date,
  ).isAfter(moment());

  const isUpcomingNextEps = moment(nextEps?.air_date).isAfter(moment());

  const filmRuntime = !isTvPage
    ? film?.runtime
    : film?.episode_run_time.length > 0 && film?.episode_run_time[0];

  const providersArray = Object.entries(providers.results);

  const providersIDArray = parsedUserLocation
    ? providersArray.find((item) => item[0] === parsedUserLocation.countryCode)
    : null;

  // Confetti
  dayjs.extend(duration);
  const now = dayjs();
  const filmReleaseDateDayjs = dayjs(
    !isTvPage ? filmReleaseDate : nextEps?.air_date,
  );
  const timeLeft = dayjs.duration(filmReleaseDateDayjs.diff(now));
  const daysLeft = timeLeft.days();

  // Get account state
  useEffect(() => {
    const getAccountStates = async (setValue) => {
      await axios
        .get(`/api/account_states`, {
          params: {
            id: film.id,
            type: !isTvPage ? `movie` : `tv`,
          },
        })
        .then(({ data: res }) => {
          setValue(res);
        })
        .catch((error) => {
          console.error("Error getting account states:", error);
        });
    };

    if (user) {
      getAccountStates(setAccountStates);
    } else {
      setAccountStates(null);
    }
  }, [film.id, isTvPage, user]);

  // Effect for user location
  useEffect(() => {
    const userLocationInLocalStorage = localStorage.getItem(USER_LOCATION);

    if (!userLocationInLocalStorage) {
      setIsLoading(true);
      checkLocationPermission(setLocation, setLocationError);
    } else {
      setLocation(userLocationInLocalStorage);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location || locationError) setIsLoading(false);
  }, [locationError, location]);

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
                {film.production_companies.map((item, i) => (
                  <div key={item.id} className={`grid place-content-center`}>
                    <ProductionCompany item={item} i={i} isTvPage={isTvPage} />
                  </div>
                ))}
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
          {/* Loading spinner */}
          {isLoading && (
            <Reveal>
              <section
                id={`Film Providers`}
                className="flex flex-col justify-center gap-1 md:justify-start"
              >
                <span className={`text-sm italic text-gray-400`}>
                  Where to watch?
                </span>

                <div className={`h-[40px]`}>
                  <span className={`loading loading-spinner`}></span>
                </div>
              </section>
            </Reveal>
          )}

          {/* Enable location button */}
          {!location && !isLoading && (
            <section
              id={`Film Providers`}
              className="flex flex-col justify-center gap-1 md:justify-start"
            >
              <span className={`text-sm italic text-gray-400`}>
                Where to watch?
              </span>

              <div className={`h-[40px]`}>
                <button
                  onClick={() => requestLocation(setLocation, setLocationError)}
                  className={`btn btn-ghost btn-sm flex h-full max-w-fit items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
                >
                  Enable location
                </button>
              </div>
            </section>
          )}

          {/* Provider list */}
          {providersIDArray && !isLoading && (
            <section
              id={`Film Providers`}
              className="flex flex-col justify-center gap-1 md:justify-start"
            >
              <span className={`text-sm italic text-gray-400`}>
                Where to watch?
              </span>

              <WatchProvider
                providersIDArray={providersIDArray}
                isTvPage={isTvPage}
              />
            </section>
          )}

          {/* NOTE: Coba ambil dari user, kayak episode yg saat ini ditonton */}
          {/* Upcoming */}
          {filmReleaseDate !== "" && (isUpcoming || isUpcomingNextEps) && (
            <section id={`Upcoming`} className={`grid gap-2 md:grid-cols-2`}>
              {lastEps && (
                <div
                  id={`TV Series Last Episode`}
                  className={`flex flex-col gap-2`}
                >
                  <Reveal>
                    <LastEpisode
                      film={film}
                      lastEps={lastEps}
                      nextEps={nextEps}
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
                    <NextEpisode film={film} nextEps={nextEps} />
                  </Reveal>
                </div>
              )}

              {(isUpcoming || isUpcomingNextEps) && (
                <>
                  <div
                    id={`Countdown`}
                    className={`md:col-span-2 ${isTvPage ? `md:row-start-2` : `md:row-start-1`} ${isTvPage && lastEps ? `md:col-start-2 md:row-start-2` : `md:col-start-1`}`}
                  >
                    <Countdown
                      movieReleaseDate={filmReleaseDate}
                      tvReleaseDate={nextEps?.air_date}
                    />
                  </div>

                  {daysLeft < 1 && (
                    <div
                      id={`Confetti`}
                      className={`pointer-events-none fixed inset-0`}
                    >
                      <Confetti
                        mode={`fall`}
                        particleCount={100}
                        shapeSize={15}
                      />
                    </div>
                  )}
                </>
              )}
            </section>
          )}
          {/* User Rating */}
          {!isUpcoming && filmReleaseDate !== "" && (
            <Reveal>
              <section
                id={`${!isTvPage ? `Movie` : `TV Series`} Rating`}
                className={`max-w-fit`}
              >
                <UserRating
                  film={film}
                  url={`/api/account/rating`}
                  rating={accountStates?.rated}
                  title={`How was ${!isTvPage ? film.title : film.name}`}
                />
              </section>
            </Reveal>
          )}
          {/* Call to Action */}
          <section id={`Share`} className={`flex flex-wrap items-end gap-1`}>
            <div className={`flex flex-col gap-1 md:flex-row`}>
              {/* Add to Favorite */}
              {!isUpcoming && filmReleaseDate !== "" && (
                <Reveal delay={0.2} className={`flex`}>
                  <FavoriteButton
                    film={film}
                    favorite={accountStates?.favorite}
                  />
                </Reveal>
              )}

              {/* Add to Watchlist */}
              <Reveal delay={0.4} className={`flex`}>
                <WatchlistButton
                  film={film}
                  watchlist={accountStates?.watchlist}
                />
              </Reveal>
            </div>

            {/* Share */}
            <Reveal delay={0.6} className={`relative ml-auto gap-4 sm:gap-0`}>
              <ShareButton />
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
