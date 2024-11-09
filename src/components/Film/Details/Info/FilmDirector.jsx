import Reveal from "@/components/Layout/Reveal";
import React from "react";
import Person from "../../../Person/Person";

export default function FilmDirector({ credits, film, isTvPage }) {
  const director = credits.crew.find((person) => person.job === "Director");

  return (
    <div className={`-mx-2`}>
      {!isTvPage
        ? credits &&
          credits.crew.length > 0 &&
          director && (
            <section
              id={`Movie Director`}
              className={`flex items-center gap-2`}
            >
              <Reveal>
                <Person
                  id={director.id}
                  name={director.name}
                  profile_path={director.profile_path}
                  role={`Director`}
                />
              </Reveal>
            </section>
          )
        : film.created_by.length > 0 && (
            <section
              id={`TV Series Creator`}
              className={`flex flex-wrap items-center`}
            >
              {film.created_by.map((item, i) => {
                return (
                  <Reveal key={item.id}>
                    <Person
                      id={item.id}
                      name={item.name}
                      profile_path={
                        item.profile_path === null
                          ? null
                          : `https://image.tmdb.org/t/p/w185${item.profile_path}`
                      }
                      role={`Creator`}
                    />
                  </Reveal>
                );
              })}
            </section>
          )}
    </div>
  );
}
