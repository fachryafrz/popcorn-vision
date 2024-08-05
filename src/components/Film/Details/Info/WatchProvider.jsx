import Reveal from "@/components/Layout/Reveal";
import { askLocation } from "@/lib/navigator";
import Link from "next/link";
import React, { useState } from "react";

export default function WatchProvider({
  providers,
  userLocation,
  setUserLocation,
  isTvPage,
}) {
  const [locationError, setLocationError] = useState();

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
            <div className={`flex flex-col text-sm italic text-gray-400`}>
              <span>Where to watch?</span>
              <button
                onClick={() => askLocation(setUserLocation, setLocationError)}
                className={`btn btn-outline btn-sm max-w-fit rounded-full`}
              >
                Click to enable location
              </button>
              {locationError && (
                <div className={`prose`}>
                  <p>{locationError}</p>
                  <p>Please follow these steps to enable location access:</p>
                  <ol>
                    <li>Click the icon on the left side of the address bar</li>
                    <li>Go to &quot;Site settings&quot;.</li>
                    <li>
                      Find &quot;Location&quot; and set it to &quot;Allow&quot;.
                    </li>
                    <li>Reload the page and click the button again.</li>
                  </ol>
                </div>
              )}
            </div>
          </section>
        </Reveal>
      )}
    </>
  );
}
