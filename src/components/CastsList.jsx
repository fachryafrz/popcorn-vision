import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import { useState } from "react";
import Casts from "./Casts";

export function CastsList({ logo, movie, loading }) {
  const [showAllActors, setShowAllActors] = useState(false);
  const [numActors, setNumActors] = useState(5);

  const handleShowAllActors = () => {
    setShowAllActors(!showAllActors);
  };

  return (
    <div className="hidden lg:flex flex-col gap-4 self-start sticky top-20 w-[500px]">
      <h2 className="font-bold text-2xl">Cast & Crews</h2>
      <div className="flex flex-col gap-4">
        {movie.credits &&
          movie.credits.cast &&
          movie.credits.cast
            .slice(0, showAllActors ? movie.credits.cast.length : numActors)
            .map((actor, index) => {
              return (
                <Casts
                  logo={logo}
                  actor={actor}
                  key={index}
                  loading={loading}
                />
              );
            })}
        {movie.credits &&
        movie.credits.cast &&
        movie.credits.cast.length > 5 ? (
          <button
            onClick={handleShowAllActors}
            className="text-primary-blue flex items-center justify-center bg-base-dark-gray gap-2 font-medium hover:bg-gray-600 py-2 px-4 sticky bottom-0"
          >
            {showAllActors ? "Show Less" : "Show All"}
            <IonIcon
              icon={
                showAllActors
                  ? Icons.chevronUpCircleOutline
                  : Icons.chevronDownCircleOutline
              }
              className="text-[1.5rem]"
            />
          </button>
        ) : (
          ``
        )}
      </div>
    </div>
  );
}
