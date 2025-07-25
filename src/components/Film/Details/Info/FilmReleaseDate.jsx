import { IonIcon } from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import moment from "moment";

export default function FilmReleaseDate({
  film,
  isTvPage,
  countryName,
  filmReleaseDate,
  filteredReleaseDateByCountry,
}) {
  const movieReleaseDate = `${moment(filmReleaseDate).format("dddd, MMMM D, YYYY")} ${filteredReleaseDateByCountry ? `(${countryName})` : ``}`;

  return (
    <>
      {filmReleaseDate || film.first_air_date ? (
        !isTvPage ? (
          filmReleaseDate && (
            <section id={`Movie Release Date`}>
              <div className={`flex items-start gap-1`}>
                <IonIcon
                  icon={calendarOutline}
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                  }}
                />

                <time dateTime={filmReleaseDate}>
                  <p>
                    <span className="sr-only">Released on:&nbsp;</span>
                    {movieReleaseDate}
                  </p>
                </time>
              </div>
            </section>
          )
        ) : (
          film.first_air_date && (
            <section id={`TV Shows Air Date`}>
              <div className={`flex items-start gap-1`}>
                <IonIcon
                  icon={calendarOutline}
                  style={{
                    fontSize: 14,
                    marginTop: 4,
                  }}
                />

                <time dateTime={film.last_air_date ?? film.first_air_date}>
                  <div className={`flex flex-wrap`}>
                    <p>
                      <span className="sr-only">First aired:&nbsp;</span>
                      {moment(film.first_air_date).format("dddd, MMMM D, YYYY")}
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
            </section>
          )
        )
      ) : (
        <div className={`flex items-start gap-1`}>
          <IonIcon
            icon={calendarOutline}
            style={{
              fontSize: 14,
              marginTop: 4,
            }}
          />

          <span>TBA</span>
        </div>
      )}
    </>
  );
}
