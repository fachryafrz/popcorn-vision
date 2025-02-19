"use client";

/* eslint-disable @next/next/no-img-element */

import { IonIcon } from "@ionic/react";
import {
  calendarOutline,
  chevronBack,
  chevronForward,
  close,
  timeOutline,
  tvOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { formatRuntime } from "@/lib/formatRuntime";
import ImagePovi from "@/components/Film/ImagePovi";

// Zustand
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import Person from "@/components/Person/Person";
import axios from "axios";
import UserRating from "../User/Actions/UserRating";
import Countdown from "../Film/Details/Info/Countdown";
import useSWR from "swr";
import { userStore } from "@/zustand/userStore";
import pluralize from "pluralize";

export function EpisodeModal({ film }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seasonParams = searchParams.get("season");
  const episodeParams = searchParams.get("episode");
  const dialogRef = useRef(null);

  const { user } = userStore();
  const { seasons } = film;

  const { data: episode } = useSWR(
    `/api/tv/${film.id}/season/${seasonParams}/episode/${episodeParams}`,
    (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const isAired = moment(episode?.air_date).isBefore(moment());
  const isUpcoming = moment(episode?.air_date).isAfter(moment());

  // const [accountStates, setAccountStates] = useState();
  const [showAllGuestStars, setShowAllGuestStars] = useState(false);
  const numGuestStars = 6;

  const filteredSeasons = seasons.filter((item) => item.season_number > 0);

  const scrollToTop = () => {
    const dialogElement = dialogRef.current;

    dialogElement.scrollTo({ top: 0 });
  };

  const handleCloseModal = () => {
    document.getElementById(`episodeModal`).close();

    router.back();
  };

  const handlePrevEpisode = () => {
    if (parseInt(seasonParams) > 1 && parseInt(episodeParams) === 1) {
      router.replace(
        `?season=${parseInt(seasonParams) - 1}&episode=${filteredSeasons[seasonParams - 2]?.episode_count}`,
        { scroll: false },
      );
      return;
    }

    router.replace(
      `?season=${seasonParams}&episode=${parseInt(episodeParams) - 1}`,
      { scroll: false },
    );

    scrollToTop();

    // document.getElementById(`episodeModal`).close();
  };

  const handleNextEpisode = () => {
    if (
      parseInt(episodeParams) ===
      filteredSeasons[seasonParams - 1]?.episode_count
    ) {
      router.replace(`?season=${parseInt(seasonParams) + 1}&episode=1`, {
        scroll: false,
      });
      return;
    }

    router.replace(
      `?season=${seasonParams}&episode=${parseInt(episodeParams) + 1}`,
      { scroll: false },
    );

    scrollToTop();

    // document.getElementById(`episodeModal`).close();
  };

  const swrKey = `/api/tv/${film.id}/season/${episode?.season_number}/episode/${episode?.episode_number}/account_states`;
  const fetcher = (url) => axios.get(url).then(({ data }) => data);
  const { data: accountStates } = useSWR(
    user && episode ? swrKey : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useEffect(() => {
    if (!seasonParams || !episodeParams) return;

    document.getElementById(`episodeModal`).showModal();
  }, [episodeParams, seasonParams]);

  const handleKeyDown = (e) => {
    if (e.key !== "Escape") return;
    handleCloseModal();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      id={`episodeModal`}
      className={`modal modal-bottom place-items-center overflow-y-auto backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur`}
    >
      <div
        className={`relative mt-12 w-full max-w-3xl pb-4 md:my-8 md:px-4 md:pb-0`}
      >
        {!episode && <EpisodeModalSkeleton />}

        {episode && (
          <>
            <div className={`pointer-events-none absolute inset-0 md:px-4`}>
              <button
                onClick={handleCloseModal}
                className={`pointer-events-auto sticky top-0 z-50 ml-auto grid aspect-square place-content-center p-4`}
              >
                <IonIcon
                  icon={close}
                  style={{
                    fontSize: 30,
                  }}
                />
              </button>
            </div>

            <div
              className={`modal-box relative max-h-none w-full max-w-none overflow-y-hidden rounded-3xl p-0`}
            >
              <ImagePovi
                imgPath={episode.still_path}
                className={`relative z-0 aspect-video overflow-hidden before:absolute before:inset-x-0 before:bottom-0 before:h-[50%] before:bg-gradient-to-t before:from-base-100`}
              >
                <picture>
                  <source
                    media="(min-width: 768px) and (max-width: 1279px)"
                    srcSet={`https://image.tmdb.org/t/p/w780${episode.still_path}`}
                  />
                  <source
                    media="(min-width: 1280px)"
                    srcSet={`https://image.tmdb.org/t/p/w1280${episode.still_path}`}
                  />
                  <img
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    role="presentation"
                    alt=""
                    aria-hidden
                    className={`object-cover`}
                    draggable={false}
                    width={500}
                    height={750}
                  />
                </picture>
              </ImagePovi>

              <div
                className={`relative z-10 -mt-[75px] flex flex-col gap-6 p-4 sm:p-8`}
              >
                <h1
                  className={`text-center text-3xl font-bold sm:text-4xl`}
                  style={{ textWrap: `balance` }}
                >
                  {episode.name}
                </h1>

                {episode.episode_type && (
                  <span
                    className={`mx-auto flex max-w-fit rounded-full bg-primary-blue bg-opacity-[10%] p-2 px-4 text-center font-medium capitalize text-primary-blue`}
                  >
                    {episode.episode_type}
                  </span>
                )}

                <div className={`flex flex-col gap-2`}>
                  {/* Episode Air Date */}
                  <section id={`Episode Air Date`}>
                    <div className={`flex items-center gap-2`}>
                      <IonIcon icon={calendarOutline} />
                      {episode.air_date ? (
                        <time dateTime={episode.air_date}>
                          {moment(episode.air_date).format(
                            "dddd, MMMM D, YYYY",
                          )}
                        </time>
                      ) : (
                        <span>TBA</span>
                      )}
                    </div>
                  </section>

                  {/* TV Shows Chapter */}
                  <section
                    id={`TV Shows Chapter`}
                    className={`flex items-center gap-2`}
                  >
                    <IonIcon icon={tvOutline} />
                    <span>
                      {`Season ${episode.season_number} (Episode ${episode.episode_number})`}
                    </span>
                  </section>

                  {/* TV Shows Average Episode Runtime */}
                  <section id={`TV Shows Average Episode Runtime`}>
                    <div className={`flex items-center gap-2`}>
                      <IonIcon icon={timeOutline} />
                      {episode.runtime ? (
                        <span>
                          {`${pluralize("minute", episode.runtime, true)} ${episode.runtime > 60 ? `(${formatRuntime(episode.runtime)})` : ""}`}
                        </span>
                      ) : (
                        <span>TBA</span>
                      )}
                    </div>
                  </section>
                </div>

                {isAired && (
                  <section id={`Episode Rating`} className={`max-w-fit`}>
                    <UserRating
                      swrKey={swrKey}
                      url={`/api/tv/${film.id}/season/${episode.season_number}/episode/${episode.episode_number}/rating`}
                      name={`rating-tv-${film.id}-season-${episode.season_number}-episode-${episode.episode_number}`}
                      rating={accountStates?.rated}
                      title={`What did you think of ${episode.name}?`}
                    />
                  </section>
                )}

                {isUpcoming && (
                  <div>
                    <Countdown tvReleaseDate={episode.air_date} />
                  </div>
                )}

                {episode.overview !== "" && (
                  <section id={`Episode Overview`}>
                    <h2 className={`text-xl font-bold text-white`}>Overview</h2>
                    <p className={`text-gray-400 md:text-lg`}>
                      {episode.overview}
                    </p>
                  </section>
                )}

                {episode.guest_stars?.length > 0 && (
                  <section id={`Guest Stars`} className={`flex flex-col`}>
                    <h2 className={`py-2 text-xl font-bold text-white`}>
                      Guest Stars
                    </h2>

                    <div className={`relative mb-2 grid sm:grid-cols-2`}>
                      {episode.guest_stars
                        .slice(
                          0,
                          showAllGuestStars
                            ? episode.guest_stars.length
                            : numGuestStars,
                        )
                        .map((item) => {
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                document.getElementById(`episodeModal`).close();
                              }}
                              className={`w-full [&_*]:w-full`}
                            >
                              <Person
                                id={item.id}
                                name={item.name}
                                profile_path={item.profile_path}
                                role={item.character}
                              />
                            </div>
                          );
                        })}
                    </div>

                    {episode.guest_stars.length > numGuestStars && (
                      <button
                        className={`btn btn-ghost mx-auto w-[25%] min-w-fit rounded-full border-none bg-white bg-opacity-5 px-12 text-primary-blue ${
                          showAllGuestStars ? `hidden` : `flex`
                        }`}
                        onClick={() => setShowAllGuestStars(true)}
                      >
                        View all
                      </button>
                    )}
                  </section>
                )}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        <div
          className={`pointer-events-none inset-0 mt-4 grid grid-cols-2 gap-2 px-4 md:px-0 lg:fixed lg:mx-auto lg:flex lg:items-center lg:justify-between lg:p-4 lg:pr-8 [&_button]:pointer-events-auto`}
        >
          <button
            onClick={handlePrevEpisode}
            disabled={
              parseInt(seasonParams) === 1 && parseInt(episodeParams) === 1
            }
            className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-10 text-sm backdrop-blur-sm`}
          >
            <IonIcon
              icon={chevronBack}
              style={{
                fontSize: 18,
              }}
            />
            <span>Previous</span>
          </button>
          <button
            onClick={handleNextEpisode}
            disabled={
              parseInt(seasonParams) === filteredSeasons.length &&
              (parseInt(episodeParams) ===
                filteredSeasons[seasonParams - 1]?.episode_count ||
                parseInt(episodeParams) === film.number_of_episodes)
            }
            className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-10 text-sm backdrop-blur-sm`}
          >
            <span>Next</span>
            <IonIcon
              icon={chevronForward}
              style={{
                fontSize: 18,
              }}
            />
          </button>
        </div>
      </div>

      {/* <form method={`dialog`} className={`modal-backdrop`}>
        <button>close</button>
      </form> */}
    </dialog>
  );
}

function EpisodeModalSkeleton() {
  return (
    <>
      <div className={`pointer-events-none absolute inset-0 md:px-4`}>
        <button
          className={`pointer-events-auto sticky top-0 z-50 ml-auto grid aspect-square place-content-center p-4`}
        >
          <IonIcon
            icon={close}
            style={{
              fontSize: 30,
            }}
          />
        </button>
      </div>

      <div
        className={`modal-box relative max-h-none w-full max-w-none overflow-y-hidden rounded-3xl p-0`}
      >
        {/* Image */}
        <div
          className={`relative z-0 aspect-video overflow-hidden before:absolute before:inset-x-0 before:bottom-0 before:h-[50%] before:bg-gradient-to-t before:from-base-100`}
        ></div>

        {/* Details */}
        <div
          className={`relative z-10 -mt-[75px] flex flex-col gap-6 p-4 sm:p-8 [&_*]:animate-pulse [&_*]:bg-gray-400 [&_*]:bg-opacity-20`}
        >
          {/* Title */}
          <section className={`mx-auto h-10 w-40 rounded-md`}></section>

          {/* Info */}
          <section className={`flex flex-col gap-2 !bg-opacity-0`}>
            <div className={`h-6 w-40 rounded-md`}></div>
            <div className={`h-6 w-40 rounded-md`}></div>
            <div className={`h-6 w-40 rounded-md`}></div>
          </section>

          {/* Overview */}
          <section className={`flex flex-col gap-2 !bg-opacity-0`}>
            {/* Overview Title */}
            <div className={`h-7 w-[88px] rounded-md`}></div>

            {/* Overview Content */}
            <div className={`flex flex-col gap-1 !bg-opacity-0`}>
              <div className={`h-6 w-full rounded-md`}></div>
              <div className={`h-6 w-full rounded-md`}></div>
              <div className={`h-6 w-[90%] rounded-md`}></div>
            </div>
          </section>

          {/* Guest Stars */}
          <section className={`flex flex-col gap-2 !bg-opacity-0`}>
            {/* Title */}
            <div className={`h-7 w-[88px] rounded-md`}></div>

            <div className={`grid gap-2 !bg-opacity-0 sm:grid-cols-2`}>
              {/* Card */}
              {[...Array(6)].map((_, index) => {
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 !bg-opacity-0`}
                  >
                    {/* Profile Image */}
                    <div
                      className={`aspect-square w-[50px] rounded-full`}
                    ></div>

                    {/* Name & Role */}
                    <div className={`flex-1 !bg-opacity-0`}>
                      <div className={`mb-1 h-5 w-32 rounded-md`}></div>
                      <div className={`h-4 w-40 rounded-md`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
