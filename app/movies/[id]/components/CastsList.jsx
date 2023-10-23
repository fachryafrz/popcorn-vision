"use client";
import { IonIcon } from "@ionic/react";
import React, { useState } from "react";
import Casts from "./Casts";
import {
  chevronDownCircleOutline,
  chevronUpCircleOutline,
} from "ionicons/icons";

export default function CastsList({ credits }) {
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
            className={`text-primary-blue flex items-center justify-center bg-base-dark-gray bg-opacity-80 backdrop-blur gap-2 font-medium hocus:bg-gray-600 py-2 px-4 text-sm whitespace-nowrap h-fit my-auto lg:hidden`}
          >
            {showAllActors ? "Show Less" : "Show All"}
          </button>
        )}
      </div>
      <div className="flex lg:flex-col overflow-x-auto lg:!overflow-x-clip gap-4 pt-4 pb-4 lg:pb-0 max-h-[calc(100dvh-20dvh)] overflow-y-auto">
        {credits &&
          credits.cast &&
          credits.cast
            .slice(0, showAllActors ? credits.cast.length : numActors)
            .map((actor) => {
              return (
                <Casts
                  key={actor.id}
                  actor={actor}
                  showAllActors={showAllActors}
                />
              );
            })}
        {credits && credits.cast && credits.cast.length > numActors && (
          <button
            onClick={handleShowAllActors}
            className={`text-primary-blue sticky bottom-0 lg:flex items-center justify-center gap-2 p-3 bg-opacity-[75%] backdrop-blur hocus:bg-white hocus:bg-opacity-10 hidden text-sm font-medium rounded-full`}
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
