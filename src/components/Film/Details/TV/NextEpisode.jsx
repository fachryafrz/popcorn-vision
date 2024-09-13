import React from "react";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";
import { formatRating } from "@/lib/formatRating";
import { isPlural } from "@/lib/isPlural";
import moment from "moment";
import EpisodeCard from "./EpisodeCard";

export default function NextEpisode({ film, nextEps }) {
  return (
    <EpisodeCard
      className={`w-full`}
      filmID={film.id}
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
              <IonIcon icon={star} className={`text-primary-yellow`} />
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
              {moment(nextEps.air_date).format("MMM D, YYYY")}
            </span>
          )}
        </>
      }
    />
  );
}
