import Reveal from "@/components/Layout/Reveal";
import { formatDate } from "@/lib/formatDate";
import { IonIcon } from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import React from "react";

export default function FilmReleaseDate({
  film,
  isTvPage,
  countryName,
  filmReleaseDate,
  releaseDateByCountry,
}) {
  return (
    <>
      {!isTvPage
        ? filmReleaseDate && (
            <section id={`Movie Release Date`}>
              <Reveal>
                <div className={`flex items-center gap-1`}>
                  <IonIcon icon={calendarOutline} />

                  <time dateTime={filmReleaseDate}>
                    {formatDate({ date: filmReleaseDate })}
                  </time>

                  {releaseDateByCountry && <span>{`(${countryName})`}</span>}
                </div>
              </Reveal>
            </section>
          )
        : film.first_air_date && (
            <section id={`TV Series Air Date`}>
              <Reveal>
                <div className={`flex items-center gap-1`}>
                  <IonIcon icon={calendarOutline} />

                  <time dateTime={film.first_air_date}>
                    {formatDate({ date: film.first_air_date })}

                    {film.last_air_date !== null &&
                      film.last_air_date !== film.first_air_date && (
                        <span className="hidden xs:inline">
                          {` - ${formatDate({ date: film.last_air_date })}`}
                        </span>
                      )}
                  </time>
                </div>
              </Reveal>
            </section>
          )}{" "}
    </>
  );
}
