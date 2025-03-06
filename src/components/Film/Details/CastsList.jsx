"use client";
import { IonIcon } from "@ionic/react";
import React, { useState } from "react";
import { chevronDownOutline, chevronUpOutline } from "ionicons/icons";
import Person from "../../Person/Person";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CastsList({ credits }) {
  const pathname = usePathname();

  const [showAllActors, setShowAllActors] = useState(false);
  const [numActors, setNumActors] = useState(5);

  const handleShowAllActors = () => {
    setShowAllActors(!showAllActors);
  };

  return (
    <div className={`sticky top-20 flex max-w-full flex-col self-start`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Casts & Credits {/* ({credits.cast.length}) */}
        </h2>{" "}
        {credits && credits.cast && credits.cast.length > numActors && (
          <button
            onClick={handleShowAllActors}
            className={`my-auto flex h-fit items-center justify-center gap-2 whitespace-nowrap rounded-full bg-base-100 bg-opacity-80 px-4 py-2 text-sm font-medium text-primary-blue backdrop-blur hocus:bg-gray-600 md:hidden`}
          >
            {showAllActors ? "Show Less" : "Show All"}
          </button>
        )}
      </div>
      <ul className="-mx-2 flex max-h-[calc(100dvh-7.5rem)] flex-col overflow-x-auto overflow-y-auto md:!overflow-x-clip md:rounded-bl-3xl">
        {credits &&
          credits.cast &&
          credits.cast
            .slice(0, showAllActors ? credits.cast.length : numActors)
            .map((actor, i) => {
              return (
                <li key={actor.id}>
                  <Link
                    href={`${pathname}/?person=${actor.id}`}
                    prefetch={false}
                  >
                    <h3 className="sr-only">
                      {`${actor.name} (${actor.character})`}
                    </h3>
                  </Link>

                  <div className={`[&_button]:w-full`}>
                    <Person
                      id={actor.id}
                      showAllActors={showAllActors}
                      name={actor.name}
                      role={actor.character}
                      profile_path={actor.profile_path}
                      before={`as`}
                      personRole={`actor`}
                    />
                  </div>
                </li>
              );
            })}

        {credits && credits.cast && credits.cast.length > numActors && (
          <div className={`sticky bottom-0 mt-2 hidden md:block`}>
            <button
              onClick={handleShowAllActors}
              className={`btn btn-ghost flex w-full rounded-full !border-none !bg-opacity-0 text-primary-blue backdrop-blur-lg hocus:!bg-opacity-10 ${
                showAllActors ? `mx-1` : ``
              }`}
            >
              {showAllActors ? "Show Less" : "Show All"}
              <IonIcon
                icon={showAllActors ? chevronUpOutline : chevronDownOutline}
                style={{
                  fontSize: 20,
                }}
              />
            </button>{" "}
          </div>
        )}
      </ul>
    </div>
  );
}
