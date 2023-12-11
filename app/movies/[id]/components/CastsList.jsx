"use client";
import { IonIcon } from "@ionic/react";
import React, { useState } from "react";
import {
  chevronDownCircleOutline,
  chevronUpCircleOutline,
} from "ionicons/icons";
import Person from "./Person";

export default function CastsList({
  credits,
  episodeModal,
  personModal,
  setPersonModal,
}) {
  const [showAllActors, setShowAllActors] = useState(false);
  const [numActors, setNumActors] = useState(5);

  const handleShowAllActors = () => {
    setShowAllActors(!showAllActors);
  };

  return (
    <div className={`max-w-full flex flex-col self-start sticky top-20`}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">
          Casts & Credits {/* ({credits.cast.length}) */}
        </h2>

        {credits && credits.cast && credits.cast.length > numActors && (
          <button
            onClick={handleShowAllActors}
            className={`text-primary-blue flex items-center justify-center bg-base-100 bg-opacity-80 backdrop-blur gap-2 font-medium hocus:bg-gray-600 py-2 px-4 text-sm whitespace-nowrap h-fit my-auto md:hidden rounded-full`}
          >
            {showAllActors ? "Show Less" : "Show All"}
          </button>
        )}
      </div>
      <div className="flex flex-col overflow-x-auto md:!overflow-x-clip pb-4 md:pb-0 max-h-[calc(100dvh-20dvh)] overflow-y-auto md:rounded-bl-3xl">
        {credits &&
          credits.cast &&
          credits.cast
            .slice(0, showAllActors ? credits.cast.length : numActors)
            .map((actor) => {
              return (
                <Person
                  key={actor.id}
                  id={actor.id}
                  showAllActors={showAllActors}
                  name={actor.name}
                  role={actor.character}
                  profile_path={
                    actor.profile_path === null
                      ? null
                      : `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  }
                  before={`as`}
                  itemProp={`actor`}
                  episodeModal={episodeModal}
                  personModal={personModal}
                  setPersonModal={setPersonModal}
                />
              );
            })}

        {credits && credits.cast && credits.cast.length > numActors && (
          <button
            onClick={handleShowAllActors}
            className={`sticky mt-2 bottom-0 text-primary-blue hidden md:flex btn btn-secondary !bg-opacity-0 !border-none hocus:!bg-opacity-10 rounded-full backdrop-blur-lg ${
              showAllActors ? `mx-1` : ``
            }`}
          >
            {showAllActors ? "Show Less" : "Show All"}
            <IonIcon
              icon={
                showAllActors
                  ? chevronUpCircleOutline
                  : chevronDownCircleOutline
              }
              className="text-[1.25rem]"
            />
          </button>
        )}
      </div>
    </div>
  );
}
