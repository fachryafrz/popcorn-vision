"use client";

import { IonIcon } from "@ionic/react";
import {
  briefcaseOutline,
  calendarOutline,
  filmOutline,
  locationOutline,
} from "ionicons/icons";
import React from "react";

export default function PersonProfile({ person, combinedCredits, isModal }) {
  // Format Date
  const dateStr = person.birthday;
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  // Release Day
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const birthdayIndex = new Date(dateStr).getDay();
  const deathdayIndex = new Date(person.deathday).getDay();
  const birthday = dayNames[birthdayIndex];
  const deathday = dayNames[deathdayIndex];

  return (
    <div
      className={`bg-secondary bg-opacity-10 rounded-2xl overflow-hidden sm:flex sm:items-center md:block ${
        isModal ? `sticky top-4` : `sticky top-20`
      }`}
    >
      {/* Profile Picture */}
      <figure
        className={`aspect-poster sm:flex-1`}
        style={{
          backgroundImage:
            person.profile_path === null
              ? `url(/popcorn.png)`
              : `url(https://image.tmdb.org/t/p/h632${person.profile_path})`,
          backgroundSize: person.profile_path === null ? `contain` : `cover`,
          backgroundRepeat: `no-repeat`,
          backgroundPosition: `center`,
        }}
      ></figure>

      {/* Person Info */}
      <div className={`p-4 pb-6 flex flex-col gap-4`}>
        <h2
          className={`text-xl md:text-3xl text-center font-bold md:mb-2`}
          style={{ textWrap: `balance` }}
        >
          {person.name}
        </h2>

        {person.deathday && (
          <div className={`flex flex-col`}>
            <section id={`Born Date`}>
              <div className={`flex items-center gap-2`}>
                <span className={`text-gray-400 italic font-medium`}>
                  Born:
                </span>

                <time dateTime={person.birthday}>
                  {`${birthday}, ${formattedDate}`}
                </time>
              </div>
            </section>

            <section id={`Death Date`}>
              <div className={`flex items-center gap-2`}>
                <span className={`text-gray-400 italic font-medium`}>
                  Death:
                </span>

                <time dateTime={person.deathday}>
                  {`${deathday}, ${new Date(person.deathday).toLocaleString(
                    "en-US",
                    options
                  )}`}
                </time>
              </div>
            </section>
          </div>
        )}

        <div className={`flex flex-col gap-1 [&_ion-icon]:min-w-[16px] [&_ion-icon]:aspect-square`}>
          {!person.deathday && (
            <section id={`Birth Date`}>
              <div className={`flex items-center gap-2`}>
                <IonIcon icon={calendarOutline} />

                <time dateTime={person.birthday}>
                  {`${birthday}, ${formattedDate}`}
                </time>
              </div>
            </section>
          )}

          {person.place_of_birth && (
            <section id={`Place of Birth`}>
              <div className={`flex items-center gap-2`}>
                <IonIcon icon={locationOutline} />
                <span title={person.place_of_birth} className={`line-clamp-1`}>
                  {person.place_of_birth}
                </span>
              </div>
            </section>
          )}

          {person.known_for_department && (
            <section id={`Known For`}>
              <div className={`flex items-center gap-2`}>
                <IonIcon icon={briefcaseOutline} />
                <span>{person.known_for_department}</span>
              </div>
            </section>
          )}

          {combinedCredits?.cast.length > 0 && (
            <section id={`Films`}>
              <div className={`flex items-center gap-2`}>
                <IonIcon icon={filmOutline} />
                <span>{`${combinedCredits?.cast.length} Film${
                  combinedCredits?.cast.length > 1 ? `s` : ``
                }`}</span>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
