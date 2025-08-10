/* eslint-disable @next/next/no-img-element */
"use client";

// Ionic React icons
import { IonIcon } from "@ionic/react";
import { timeOutline, tvOutline } from "ionicons/icons";

import TitleLogo from "@/components/Film/TitleLogo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { formatRuntime } from "@/lib/formatRuntime";
import WatchlistButton from "../../../User/Actions/WatchlistButton";
import FavoriteButton from "../../../User/Actions/FavoriteButton";
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
import moment from "moment";
import { useLocation } from "@/zustand/location";
import useSWR from "swr";
import { userStore } from "@/zustand/userStore";
import pluralize from "pluralize";
import { handleOpenWindow } from "@/lib/openWindow";
import WatchButton from "@/components/Layout/WatchButton";
import AddToCalendar from "./AddToCalendar";
import { useMemo } from "react";

export default function FilmInfo({
  film,
  images,
  credits,
  providers,
  releaseDates,
}) {
  const { user } = userStore();
  const { location } = useLocation();

  const countryCode = location?.country_code;
  const countryName = location?.country_name;

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const director = useMemo(
    () => credits.crew.find((person) => person.job === "Director"),
    [credits],
  );

  const nextEps = useMemo(() => film.next_episode_to_air, [film]);
  const lastEps = useMemo(() => film.last_episode_to_air, [film]);

  // Release Date
  const filteredReleaseDateByCountry = useMemo(() => {
    const releaseDateByCountry = releaseDates?.results.find(
      (item) => item.iso_3166_1 === countryCode,
    );
    const validTypes = [2, 3];
    const validReleaseDates =
      releaseDateByCountry?.release_dates?.filter((item) =>
        validTypes.includes(item.type),
      ) ?? [];

    return validReleaseDates.length
      ? validReleaseDates.reduce((earliest, current) =>
          moment(current.release_date).isBefore(earliest.release_date)
            ? current
            : earliest,
        )
      : null;
  }, [releaseDates, countryCode]);

  const filmReleaseDate = useMemo(() => {
    return filteredReleaseDateByCountry
      ? filteredReleaseDateByCountry?.release_date
      : film?.release_date;
  }, [film, filteredReleaseDateByCountry]);

  const isUpcoming = useMemo(() => {
    const today = moment();
    return moment(!isTvPage ? filmReleaseDate : film?.first_air_date).isAfter(
      today,
    );
  }, [film, filmReleaseDate, isTvPage]);
  const isUpcomingOriginalReleaseDate = useMemo(() => {
    const today = moment();
    return moment(
      !isTvPage ? film?.release_date : film?.first_air_date,
    ).isAfter(today);
  }, [film, isTvPage]);

  const isUpcomingNextEps = useMemo(() => {
    const today = moment();
    return moment(nextEps?.air_date).isAfter(today);
  }, [nextEps]);

  const filmRuntime = useMemo(() => {
    return !isTvPage
      ? film?.runtime
      : film?.episode_run_time.length > 0 && film?.episode_run_time[0];
  }, [film, isTvPage]);

  const providersArray = useMemo(() => {
    return Object.entries(providers.results);
  }, [providers]);

  const providersIDArray = useMemo(() => {
    return location
      ? providersArray.find((item) => item[0] === countryCode)
      : null;
  }, [providersArray, location, countryCode]);

  // Get account state using SWR
  const swrKey = `/api/${!isTvPage ? "movie" : "tv"}/${film.id}/account_states`;
  const fetcher = (url) => axios.get(url).then(({ data }) => data);
  const { data: accountStates } = useSWR(user ? swrKey : null, fetcher);

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
          <h1
            className="max-w-fit text-center text-3xl font-bold !leading-normal md:text-start md:text-5xl"
            style={{ textWrap: `balance` }}
          >
            {!isTvPage ? film.title : film.name}
          </h1>
        )}

        <div
          className={`flex w-full flex-col gap-4 text-sm md:gap-2 lg:text-base`}
        >
          {/* Film Production Company */}
          {film.production_companies?.length > 0 && (
            <section id={`Production Companies`}>
              <p className="sr-only">Produced by:</p>

              <ul
                className={`flex flex-wrap justify-center gap-4 md:mb-4 md:justify-start`}
              >
                {film.production_companies.map((item, i) => (
                  <li key={item.id} className={`grid place-content-center`}>
                    <ProductionCompany item={item} i={i} isTvPage={isTvPage} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {/* Film Release Date */}
          <FilmReleaseDate
            film={film}
            isTvPage={isTvPage}
            countryName={countryName}
            filmReleaseDate={filmReleaseDate}
            filteredReleaseDateByCountry={filteredReleaseDateByCountry}
          />
          {/* TV Shows Number of Season */}
          {isTvPage &&
            film.number_of_seasons > 0 &&
            film.number_of_episodes > 0 && (
              <section id={`TV Shows Chapter`}>
                <div className={`flex items-start gap-1`}>
                  <IonIcon
                    icon={tvOutline}
                    style={{
                      fontSize: 14,
                      marginTop: 4,
                    }}
                  />

                  <p>
                    <span className="sr-only">Chapter:&nbsp;</span>
                    {`${pluralize("Season", film.number_of_seasons, true)} (${pluralize(
                      "Episode",
                      film.number_of_episodes,
                      true,
                    )})`}
                  </p>
                </div>
              </section>
            )}
          {/* Film Runtime */}
          {filmRuntime > 0 ? (
            <section id={`Movie Runtime`}>
              <div className={`flex items-start gap-1`}>
                <IonIcon
                  icon={timeOutline}
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                  }}
                />
                <time>
                  <p>
                    <span className="sr-only">Runtime:&nbsp;</span>
                    {`${pluralize("minute", filmRuntime, true)} ${filmRuntime > 60 ? `(${formatRuntime(filmRuntime)})` : ``}`}
                  </p>
                </time>
              </div>
            </section>
          ) : (
            !isTvPage && (
              <div className={`flex items-start gap-1`}>
                <IonIcon
                  icon={timeOutline}
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                  }}
                />
                <span>TBA</span>
              </div>
            )
          )}
          {/* Film Genres */}
          {film.genres && film.genres.length > 0 && (
            <section id={`Film Genres`}>
              <p className="sr-only">
                {pluralize("Genre", film.genres.length)}:
              </p>
              <ul className={`flex flex-wrap gap-1`}>
                {film.genres.map((item, i) => {
                  return (
                    <li key={item.id}>
                      <Link
                        href={
                          !isTvPage
                            ? `/search?with_genres=${item.id}`
                            : `/tv/search?with_genres=${item.id}`
                        }
                        prefetch={false}
                        className={`btn btn-ghost rounded-full bg-secondary bg-opacity-20 backdrop-blur`}
                      >
                        <p>{item.name}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* NOTE: I don't remove this because Reading Mode can't access from button tag */}
          {/* Film Director / Creator */}
          {!isTvPage && director ? (
            <p className="sr-only">{`Directed by: ${director.name}`}</p>
          ) : (
            film.created_by?.length > 0 && (
              <>
                <p className="sr-only">Created by:</p>
                <ul className="sr-only">
                  {film.created_by.map((person) => {
                    return (
                      <li key={person.id}>
                        <Link
                          href={`${pathname}/?person=${person.id}`}
                          prefetch={false}
                        >
                          <p>{person.name}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )
          )}
          <FilmDirector film={film} credits={credits} isTvPage={isTvPage} />

          {/* Streaming */}
          {filmReleaseDate !== "" && !isUpcomingOriginalReleaseDate && (
            <section className={`mb-2`}>
              <WatchButton mediaType={isTvPage ? "tv" : "movie"} />
            </section>
          )}

          {/* Film Watch Provider */}
          <section
            id={`Film Providers`}
            className="mb-2 flex flex-col justify-center gap-1 md:justify-start"
          >
            <span aria-hidden className={`text-sm font-medium`}>
              Available on
            </span>

            <div className={`flex flex-wrap gap-2`}>
              {/* TMDB as Provider */}
              <button
                onClick={() =>
                  handleOpenWindow(
                    `https://www.themoviedb.org/${!isTvPage ? "movie" : "tv"}/${film.id}/watch`,
                  )
                }
                prefetch={false}
                className={`flex`}
              >
                <div
                  className="tooltip tooltip-bottom before:!hidden before:!rounded-full before:!bg-black before:!bg-opacity-80 before:!p-4 before:!py-2 before:!font-semibold before:!backdrop-blur after:!hidden md:before:!inline-block"
                  data-tip={`The Movie Database`}
                >
                  <img
                    src={`/provider/tmdb.png`}
                    draggable={false}
                    alt=""
                    aria-hidden
                    role="presentation"
                    className={`aspect-square w-[50px] rounded-xl`}
                    width={50}
                    height={50}
                  />
                  <span aria-hidden className={`sr-only`}>
                    The Movie Database
                  </span>
                </div>
              </button>

              {providersIDArray && (
                <WatchProvider
                  film={film}
                  providersIDArray={providersIDArray}
                  isTvPage={isTvPage}
                />
              )}
            </div>
          </section>

          {/* Upcoming */}
          {filmReleaseDate !== "" && (isUpcoming || isUpcomingNextEps) && (
            <section id={`Upcoming`} className={`grid gap-2 md:grid-cols-2`}>
              {lastEps && (
                <div
                  id={`TV Shows Last Episode`}
                  className={`flex flex-col gap-2`}
                >
                  <LastEpisode
                    film={film}
                    lastEps={lastEps}
                    nextEps={nextEps}
                  />
                </div>
              )}

              {nextEps && (
                <div
                  id={`TV Shows Next Episode`}
                  className={`flex flex-col gap-2`}
                >
                  <NextEpisode film={film} nextEps={nextEps} />
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
                </>
              )}
            </section>
          )}
          {/* User Rating */}
          {!isUpcoming && filmReleaseDate !== "" && (
            <section
              id={`${!isTvPage ? `Movie` : `TV Shows`} Rating`}
              className={`max-w-fit`}
            >
              <UserRating
                swrKey={swrKey}
                url={`/api/${!isTvPage ? `movie` : `tv`}/${film.id}/rating`}
                name={`rating-${!isTvPage ? `movie` : `tv`}-${film.id}`}
                rating={accountStates?.rated}
                title={`What did you think of ${!isTvPage ? film.title : film.name}?`}
              />
            </section>
          )}
          {/* Call to Action */}
          <section
            id={`Share`}
            className={`flex flex-wrap items-end justify-between gap-1`}
          >
            <div className={`flex flex-col gap-1 md:flex-row`}>
              {/* Add to Favorite */}
              {!isUpcoming && filmReleaseDate !== "" && (
                <FavoriteButton
                  swrKey={swrKey}
                  film={film}
                  favorite={accountStates?.favorite}
                />
              )}

              {/* Add to Watchlist */}
              <WatchlistButton
                swrKey={swrKey}
                film={film}
                watchlist={accountStates?.watchlist}
              />

              {/* Add to Calendar */}
              {(isUpcoming || isUpcomingNextEps) && filmReleaseDate !== "" && (
                <AddToCalendar film={film} />
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {/* Share */}
              <ShareButton />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
