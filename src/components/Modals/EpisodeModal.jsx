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
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { formatRuntime } from "@/lib/formatRuntime";
import { isPlural } from "@/lib/isPlural";
import ImagePovi from "@/components/Film/ImagePovi";

// Zustand
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEpisodeModal } from "@/zustand/episodeModal";
import moment from "moment";
import Person from "@/components/Person/Person";
import axios from "axios";
import UserRating from "../User/Actions/UserRating";
import { useAuth } from "@/hooks/auth";
import Countdown from "../Film/Details/Info/Countdown";

export function EpisodeModal({ film, seasons, episode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const seasonParams = searchParams.get("season");
  const episodeParams = searchParams.get("episode");
  const dialogRef = useRef(null);
  const isAired = moment(episode.air_date).isBefore(moment());
  const isUpcoming = moment(episode.air_date).isAfter(moment());

  const { user } = useAuth();

  const [showAllGuestStars, setShowAllGuestStars] = useState(false);
  const numGuestStars = 6;

  const { setEpisodeModal } = useEpisodeModal((state) => state);

  const handleShowAllGuestStars = () => {
    setShowAllGuestStars(true);
  };

  const scrollToTop = () => {
    const dialogElement = dialogRef.current;

    dialogElement.scrollTo({
      top: 0,
      behavior: `smooth`,
    });
  };

  const filteredSeasons = seasons.filter((item) => item.season_number > 0);
  console.log(filteredSeasons);

  const handleCloseModal = () => {
    document.getElementById(`episodeModal`).close();
    router.replace(pathname, { scroll: false });

    setTimeout(() => {
      // Zustand
      setEpisodeModal(null);
    }, 100);
  };

  const handlePrevEpisode = () => {
    if (parseInt(seasonParams) > 1 && parseInt(episodeParams) === 1) {
      router.replace(
        `?season=${parseInt(seasonParams) - 1}&episode=${filteredSeasons[seasonParams - 2]?.episode_count}`,
        {
          scroll: false,
        },
      );
      return;
    }

    router.replace(
      `?season=${seasonParams}&episode=${parseInt(episodeParams) - 1}`,
      {
        scroll: false,
      },
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
      {
        scroll: false,
      },
    );

    scrollToTop();

    // document.getElementById(`episodeModal`).close();
  };

  useEffect(() => {
    setShowAllGuestStars(false);
  }, [episode]);

  // NOTE: EPISODE RATING
  const [accountStates, setAccountStates] = useState();

  useEffect(() => {
    const getAccountStates = async () => {
      try {
        const { data } = await axios.get(
          `/api/tv/season/episode/account_states`,
          {
            params: {
              id: film.id,
              season_number: episode.season_number,
              episode_number: episode.episode_number,
            },
          },
        );

        setAccountStates(data);
      } catch (error) {
        console.error("Error getting account states:", error);
      }
    };

    getAccountStates();
  }, [episode, film]);

  return (
    <dialog
      ref={dialogRef}
      id={`episodeModal`}
      className={`modal modal-bottom place-items-center overflow-y-auto backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur`}
    >
      <div className={`relative w-full max-w-3xl p-4 pt-24 sm:py-8`}>
        <div
          className={`pointer-events-none absolute inset-0 p-4 pt-24 sm:py-8`}
        >
          <button
            onClick={handleCloseModal}
            className={`pointer-events-auto sticky top-0 z-50 ml-auto grid aspect-square place-content-center p-4`}
          >
            <IonIcon icon={close} className={`text-3xl`} />
          </button>
        </div>

        <div
          className={`modal-box relative max-h-none w-full max-w-none overflow-y-hidden rounded-2xl p-0`}
        >
          <ImagePovi
            imgPath={
              episode.still_path &&
              `https://image.tmdb.org/t/p/w92${episode.still_path}`
            }
            className={`relative z-0 aspect-video overflow-hidden before:absolute before:inset-x-0 before:bottom-0 before:h-[50%] before:bg-gradient-to-t before:from-base-100`}
          >
            {episode.still_path && (
              <img
                src={`https://image.tmdb.org/t/p/w1280${episode.still_path}`}
                alt={episode.name}
                className={`object-cover`}
                draggable={false}
                loading="lazy"
              />
            )}
          </ImagePovi>

          <div
            className={`relative z-10 -mt-[75px] flex flex-col gap-6 p-4 sm:p-8`}
          >
            <h1
              title={episode.name}
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
                  <time dateTime={episode.air_date}>
                    {moment(episode.air_date).format("dddd, MMMM D, YYYY")}
                  </time>
                </div>
              </section>

              {/* TV Series Chapter */}
              <section
                id={`TV Series Chapter`}
                className={`flex items-center gap-2`}
              >
                <IonIcon icon={tvOutline} />
                <span>
                  {`Season ${episode.season_number} (Episode ${episode.episode_number})`}
                </span>
              </section>

              {/* TV Series Average Episode Runtime */}
              <section id={`TV Series Average Episode Runtime`}>
                <div className={`flex items-center gap-2`}>
                  <IonIcon icon={timeOutline} />
                  <time>
                    {episode.runtime ? episode.runtime : 0}{" "}
                    {isPlural({ text: "minute", number: episode.runtime % 60 })}
                  </time>
                  {Math.floor(episode.runtime / 60) >= 1 && (
                    <span>{`(${formatRuntime(episode.runtime)})`}</span>
                  )}
                </div>
              </section>
            </div>

            {user && isAired && (
              <section id={`Episode Rating`} className={`max-w-fit`}>
                <UserRating
                  film={film}
                  url={`/api/tv/season/episode/rating`}
                  season={episode.season_number}
                  episode={episode.episode_number}
                  rating={accountStates?.rated}
                  title={`What did you think of ${episode.name}`}
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
                <p className={`text-gray-400 md:text-lg`}>{episode.overview}</p>
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
                        <Person
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          profile_path={
                            item.profile_path === null
                              ? null
                              : `https://image.tmdb.org/t/p/w185${item.profile_path}`
                          }
                          role={item.character}
                        />
                      );
                    })}
                </div>

                {episode.guest_stars.length > numGuestStars && (
                  <button
                    className={`btn btn-ghost mx-auto w-[25%] min-w-fit rounded-full border-none bg-white bg-opacity-5 px-12 text-primary-blue ${
                      showAllGuestStars ? `hidden` : `flex`
                    }`}
                    onClick={handleShowAllGuestStars}
                  >
                    View all
                  </button>
                )}
              </section>
            )}
          </div>
        </div>

        {/* Pagination */}
        <Suspense>
          <div
            className={`pointer-events-none inset-0 mt-4 grid grid-cols-2 gap-2 lg:fixed lg:mx-auto lg:flex lg:items-center lg:justify-between lg:p-4 lg:pr-8 [&_button]:pointer-events-auto`}
          >
            <button
              onClick={handlePrevEpisode}
              disabled={
                parseInt(seasonParams) === 1 && parseInt(episodeParams) === 1
              }
              className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-10 text-sm backdrop-blur-sm`}
            >
              <IonIcon icon={chevronBack} className={`text-lg`} />
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
              <IonIcon icon={chevronForward} className={`text-lg`} />
            </button>
          </div>
        </Suspense>
      </div>

      {/* <form method={`dialog`} className={`modal-backdrop`}>
        <button>close</button>
      </form> */}
    </dialog>
  );
}
