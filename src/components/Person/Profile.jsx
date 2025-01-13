/* eslint-disable @next/next/no-img-element */
"use client";

import ImagePovi from "@/components/Film/ImagePovi";
import { isPlural } from "@/lib/isPlural";
import { IonIcon } from "@ionic/react";
import {
  briefcaseOutline,
  calendarOutline,
  filmOutline,
  locationOutline,
} from "ionicons/icons";
import moment from "moment";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function PersonProfile({ person, combinedCredits, isModal }) {
  const router = useRouter();
  const pathname = usePathname();
  const isTvPage = pathname.startsWith(`/tv`);

  // Format Date
  const birthday = moment(person.birthday).format("dddd, MMMM D, YYYY");
  const deathday = moment(person.deathday).format("dddd, MMMM D, YYYY");
  const personJob = person.known_for_department;
  const isActing = personJob === "Acting";
  const personWorks = isActing ? combinedCredits?.cast : combinedCredits?.crew;

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-secondary bg-opacity-10 sm:flex sm:items-center md:block ${
        isModal ? `sticky top-4` : `sticky top-20`
      }`}
    >
      {/* Profile Picture */}
      <ImagePovi
        imgPath={person.profile_path}
        className={`aspect-poster sm:flex-1`}
      >
        <img
          src={`https://image.tmdb.org/t/p/w780${person.profile_path}`}
          role="presentation"
          draggable={false}
          alt=""
          aria-hidden
          width={780}
          height={1170}
        />
      </ImagePovi>

      {/* Person Info */}
      <div className={`flex flex-col gap-4 p-4 pb-6`}>
        <Link
          href={`/search?${isActing ? `with_cast` : `with_crew`}=${person.id}`}
          prefetch={true}
        >
          <h2
            className={`text-center text-2xl font-bold md:mb-2 md:text-3xl`}
            style={{ textWrap: `balance` }}
          >
            {person.name}
          </h2>
        </Link>

        {person.deathday && (
          <div className={`flex flex-col`}>
            <section id={`Born Date`}>
              <div className={`flex items-center gap-2`}>
                <span className={`font-medium italic text-gray-400`}>
                  Born:
                </span>

                <time dateTime={person.birthday}>{birthday}</time>
              </div>
            </section>

            <section id={`Death Date`}>
              <div className={`flex items-center gap-2`}>
                <span className={`font-medium italic text-gray-400`}>
                  Death:
                </span>

                <time dateTime={person.deathday}>{deathday}</time>
              </div>
            </section>
          </div>
        )}

        <div
          className={`flex flex-col gap-1 [&_ion-icon]:aspect-square [&_ion-icon]:min-w-[16px]`}
        >
          {!person.deathday && person.birthday && (
            <section id={`Birth Date`}>
              <div className={`flex items-center gap-2`}>
                <IonIcon icon={calendarOutline} />

                <time dateTime={person.birthday}>{birthday}</time>
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

          {personWorks.length > 0 && (
            <section id={`Films`}>
              <div className={`flex items-center gap-2`}>
                <IonIcon icon={filmOutline} />
                <span>{`${personWorks.length} ${isPlural({
                  text: "Film",
                  number: personWorks.length,
                })}`}</span>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
