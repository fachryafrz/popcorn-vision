import React from "react";
import EpisodeCard from "../../EpisodeCard";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";
import { formatRating } from "@/lib/formatRating";
import { formatDate } from "@/lib/formatDate";
import { isPlural } from "@/lib/isPlural";

export default function LastEpisode({ film, lastEps, nextEps, setLoading }) {
  return (
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
              <IonIcon icon={star} className={`text-primary-yellow`} />
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
  );
}
