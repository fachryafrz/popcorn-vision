import Reveal from "@/components/Layout/Reveal";
import { IonIcon } from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import moment from "moment";
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
                    {moment(filmReleaseDate).format("dddd, MMMM D, YYYY")}
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

                  <time dateTime={film.last_air_date ?? film.first_air_date}>
                    {moment(film.first_air_date).format("dddd, MMMM D, YYYY")}

                    {film.last_air_date !== null &&
                      film.last_air_date !== film.first_air_date && (
                        <span className="hidden xs:inline">
                          {` - ${moment(film.last_air_date).format("dddd, MMMM D, YYYY")}`}
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
