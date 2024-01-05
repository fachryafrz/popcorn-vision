/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { calendarOutline, close, timeOutline, tvOutline } from "ionicons/icons";
import Person from "./Person";
import { useContext, useEffect, useState } from "react";
import { formatDate } from "@/app/lib/formatDate";
import { formatRuntime } from "@/app/lib/formatRuntime";
import { isPlural } from "@/app/lib/isPlural";
import { DetailsContext } from "../context";
import ImagePovi from "@/app/components/ImagePovi";

export function EpisodeModal({ episode }) {
  const [showAllGuestStars, setShowAllGuestStars] = useState(false);
  const numGuestStars = 6;

  const { setEpisodeModal } = useContext(DetailsContext);

  const handleShowAllGuestStars = () => {
    setShowAllGuestStars(true);
  };

  useEffect(() => {
    setShowAllGuestStars(false);
  }, [episode]);

  return (
    <dialog
      id={`episodeModal`}
      className={`modal modal-bottom place-items-center backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur overflow-y-auto`}
    >
      <div className={`p-4 pt-24 sm:py-8 relative w-full max-w-3xl`}>
        <div
          className={`pointer-events-none absolute inset-0 p-4 pt-24 sm:py-8`}
        >
          <button
            onClick={() => {
              document.getElementById(`episodeModal`).close();
              setTimeout(() => {
                setEpisodeModal(null);
              }, 100);
            }}
            className={`grid place-content-center aspect-square sticky top-0 ml-auto z-50 p-4 pointer-events-auto`}
          >
            <IonIcon icon={close} className={`text-3xl`} />
          </button>
        </div>

        <div
          className={`modal-box rounded-2xl max-w-none w-full p-0 relative max-h-none overflow-y-hidden`}
        >
          <ImagePovi
            imgPath={
              episode.still_path &&
              `https://image.tmdb.org/t/p/w92${episode.still_path}`
            }
            className={`aspect-video relative before:absolute before:inset-x-0 before:bottom-0 before:h-[50%] before:bg-gradient-to-t before:from-base-100 overflow-hidden z-0`}
          >
            {episode.still_path && (
              <img
                src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
                alt={episode.name}
                className={`object-cover pointer-events-none`}
              />
            )}
          </ImagePovi>

          <div
            className={`p-4 sm:p-8 -mt-[75px] z-10 relative flex flex-col gap-6`}
          >
            <h1
              title={episode.name}
              className={`text-3xl sm:text-4xl text-center font-bold`}
              style={{ textWrap: `balance` }}
            >
              {episode.name}
            </h1>

            {episode.episode_type && (
              <span
                className={`bg-primary-blue bg-opacity-[10%] text-primary-blue flex text-center max-w-fit p-2 px-4 rounded-full mx-auto capitalize`}
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
                <h2 className={`font-bold text-xl text-white`}>Overview</h2>
                <p className={`text-gray-400 md:text-lg`}>{episode.overview}</p>
              </section>
            )}

            {episode.guest_stars?.length > 0 && (
              <section id={`Guest Stars`} className={`flex flex-col`}>
                <h2 className={`font-bold text-xl text-white py-2`}>
                  Guest Stars
                </h2>

                <div className={`grid sm:grid-cols-2 relative mb-2`}>
                  {episode.guest_stars
                    .slice(
                      0,
                      showAllGuestStars
                        ? episode.guest_stars.length
                        : numGuestStars
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
                    className={`btn btn-ghost bg-white text-primary-blue rounded-full px-12 min-w-fit w-[25%] bg-opacity-5 border-none mx-auto ${
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
