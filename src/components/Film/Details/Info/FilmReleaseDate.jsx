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
  const movieReleaseDate = `${moment(filmReleaseDate).format("dddd, MMMM D, YYYY")} ${releaseDateByCountry ? `(${countryName})` : ``}`;

  return (
    <>
      {filmReleaseDate || film.first_air_date ? (
        !isTvPage ? (
          filmReleaseDate && (
            <section id={`Movie Release Date`}>
              <Reveal>
                <div className={`flex items-start gap-1`}>
                  <IonIcon
                    icon={calendarOutline}
                    className={`mt-1 min-w-[14px]`}
                  />

                  <time dateTime={filmReleaseDate}>
                    <p>
                      <span className="sr-only">Released on:&nbsp;</span>
                      {movieReleaseDate}
                    </p>
                  </time>
                </div>
              </Reveal>
            </section>
          )
        ) : (
          film.first_air_date && (
            <section id={`TV Shows Air Date`}>
              <Reveal>
                <div className={`flex items-start gap-1`}>
                  <IonIcon
                    icon={calendarOutline}
                    className={`mt-1 min-w-[14px]`}
                  />

                  <time dateTime={film.last_air_date ?? film.first_air_date}>
                    <div className={`flex flex-wrap`}>
                      <p>
                        <span className="sr-only">First aired:&nbsp;</span>
                        {moment(film.first_air_date).format(
                          "dddd, MMMM D, YYYY",
                        )}
                      </p>

                      {film.last_air_date &&
                        film.last_air_date !== film.first_air_date && (
                          <>
                            <span>&nbsp;-&nbsp;</span>

                            <p>
                              <span className="sr-only">Last aired:&nbsp;</span>
                              {`${moment(film.last_air_date).format("dddd, MMMM D, YYYY")}`}
                            </p>
                          </>
                        )}
                    </div>
                  </time>
                </div>
              </Reveal>
            </section>
          )
        )
      ) : (
        <span>TBA</span>
      )}
    </>
  );
}
