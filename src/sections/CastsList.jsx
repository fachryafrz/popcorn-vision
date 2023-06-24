import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import { useState } from "react";
import Casts from "../components/Casts";
import { Loading } from "../components/Loading";

export function CastsList({ logo, movie, loading }) {
  const [showAllActors, setShowAllActors] = useState(false);
  const [numActors, setNumActors] = useState(5);

  const handleShowAllActors = () => {
    setShowAllActors(!showAllActors);
  };

  return (
    <div className={`max-w-full flex flex-col self-start sticky top-20`}>
      <div className="flex items-center justify-between">
        {loading ? (
          <Loading height="[30px] !w-[150px]" className={`h-[30px]`} />
        ) : (
          <h2 className="font-bold text-2xl">Cast & Crews</h2>
        )}
        <button
          onClick={handleShowAllActors}
          className={`text-primary-blue ${
            !loading ? `flex` : `hidden`
          } items-center justify-center bg-base-dark-gray bg-opacity-80 backdrop-blur gap-2 font-medium hover:bg-gray-600 py-2 px-4 text-sm whitespace-nowrap h-fit my-auto lg:hidden`}
        >
          {showAllActors ? "Show Less" : "Show All"}
        </button>
      </div>
      <div className="flex lg:flex-col overflow-x-auto lg:!overflow-x-clip gap-4 pt-4 pb-4 lg:pb-0 max-h-[500px] overflow-y-auto">
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
                  showAllActors={showAllActors}
                />
              );
            })}
        {movie.credits &&
        movie.credits.cast &&
        movie.credits.cast.length > numActors ? (
          <button
            onClick={handleShowAllActors}
            className={`text-primary-blue ${
              !loading ? `opacity-100` : `opacity-0`
            } sticky -bottom-1 lg:flex items-center justify-center gap-2 p-3 bg-base-dark-gray bg-opacity-[75%] backdrop-blur hover:bg-white hover:bg-opacity-10 hidden text-sm font-medium mb-2`}
          >
            {showAllActors ? "Show Less" : "Show All"}
            <IonIcon
              icon={
                showAllActors
                  ? Icons.chevronUpCircleOutline
                  : Icons.chevronDownCircleOutline
              }
              className="text-[1.25rem]"
            />
          </button>
        ) : (
          ``
        )}
      </div>
    </div>
  );
}
