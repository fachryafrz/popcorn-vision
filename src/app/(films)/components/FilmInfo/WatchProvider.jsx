import Reveal from "@/components/Layout/Reveal";
import Link from "next/link";
import React from "react";

export default function WatchProvider({ providers, userLocation, isTvPage }) {
  const providersArray = Object.entries(providers.results);
  const providersIDArray =
    userLocation &&
    providersArray.find(
      (item) => item[0] === JSON.parse(userLocation).countryCode,
    );

  return (
    <>
      {providers.results && providersIDArray ? (
        <section
          id={`Film Providers`}
          className="flex flex-col justify-center gap-1 md:justify-start"
        >
          <Reveal>
            <span className={`text-sm italic text-gray-400`}>
              Where to watch?
            </span>
          </Reveal>
          <div className={`flex flex-wrap gap-2`}>
            {(
              providersIDArray[1].rent ||
              providersIDArray[1].buy ||
              providersIDArray[1].flatrate ||
              providersIDArray[1].ads
            ).map(
              (item, i) =>
                item.logo_path !== null && (
                  <Reveal delay={0.2 * i} key={item.provider_id}>
                    <Link
                      href={`${
                        !isTvPage ? `/search` : `/tv/search`
                      }?watch_providers=${item.provider_id}`}
                    >
                      <figure
                        title={item.provider_name}
                        style={{
                          background: `url(https://image.tmdb.org/t/p/w500${item.logo_path})`,
                          backgroundSize: `contain`,
                          backgroundRepeat: `no-repeat`,
                        }}
                        className={`aspect-square w-[40px] rounded-xl`}
                      ></figure>
                    </Link>
                  </Reveal>
                ),
            )}
          </div>
        </section>
      ) : userLocation ? (
        providersIDArray && (
          <Reveal>
            <section id={`Film Providers`}>
              <span className={`text-sm italic text-gray-400`}>
                Where to watch? <br /> Hold on we&apos;re still finding...
              </span>
            </section>
          </Reveal>
        )
      ) : (
        <Reveal>
          <section id={`Film Providers`}>
            <span className={`text-sm italic text-gray-400`}>
              Where to watch? <br /> Please enable location services to find out
              where to watch this film.
            </span>
          </section>
        </Reveal>
      )}
    </>
  );
}
