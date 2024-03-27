/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { calendarOutline, close, timeOutline, tvOutline } from "ionicons/icons";
import Person from "./Person";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/formatDate";
import { formatRuntime } from "@/lib/formatRuntime";
import { isPlural } from "@/lib/isPlural";
import ImagePovi from "@/components/Film/ImagePovi";

// Redux Toolkit
import { useSelector, useDispatch } from "react-redux";
import { setEpisode } from "@/redux/slices/episodeSlice";
import { useRouter } from "next/navigation";

export function EpisodeModal({ episode }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showAllGuestStars, setShowAllGuestStars] = useState(false);
  const numGuestStars = 6;

  const handleShowAllGuestStars = () => {
    setShowAllGuestStars(true);
  };

  useEffect(() => {
    setShowAllGuestStars(false);
  }, [episode]);

  return (
    <dialog
      id={`episodeModal`}
      className={`modal modal-bottom place-items-center overflow-y-auto backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur`}
    >
      <div className={`relative w-full max-w-3xl p-4 pt-24 sm:py-8`}>
        <div
          className={`pointer-events-none absolute inset-0 p-4 pt-24 sm:py-8`}
        >
          <button
            onClick={() => {
              document.getElementById(`episodeModal`).close();
              router.back();
              setTimeout(() => {
                // Redux Toolkit
                dispatch(setEpisode(null));
              }, 100);
            }}
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
                src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
                alt={episode.name}
                className={`pointer-events-none object-cover`}
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
                    {formatDate({
                      date: episode.air_date,
                    })}
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

            {episode.overview != "" && (
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
      </div>

      {/* <form method={`dialog`} className={`modal-backdrop`}>
        <button>close</button>
      </form> */}
    </dialog>
  );
}
