/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { filmOutline, tvOutline, search } from "ionicons/icons";
import Link from "next/link";
import React, { useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isTvPage = pathname.startsWith("/tv");
  const isSearchPage = pathname.startsWith(
    !isTvPage ? `/search` : `/tv/search`
  );
  let URLSearchQuery = useSearchParams().get("query");

  return (
    <header className="sticky top-0 z-50 bg-base-100 backdrop-blur bg-opacity-[85%]">
      <nav className="mx-auto py-2 px-4 max-w-7xl flex flex-wrap justify-between">
        <Link
          href={!isTvPage ? `/` : `/tv`}
          className="flex gap-1 items-center font-semibold tracking-wide leading-none max-w-fit"
        >
          <figure
            style={{
              background: `url(/popcorn.png)`,
              backgroundSize: `contain`,
            }}
            className={`w-[50px] aspect-square`}
          ></figure>
          <figcaption
            className={`w-[70px] after:content-["Popcorn_Vision"] after:leading-tight after:h-full after:flex after:items-center`}
          ></figcaption>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex place-content-center w-fit gap-1 p-1 rounded-xl bg-[#323946] bg-opacity-30 backdrop-blur">
            <Link
              href={
                isSearchPage
                  ? URLSearchQuery
                    ? `/search?query=${URLSearchQuery.replace(/\s+/g, "+")}`
                    : `/search`
                  : `/`
              }
              className={`font-medium py-2 px-2 sm:px-4 rounded-lg hocus:bg-secondary hocus:bg-opacity-20 flex items-center gap-2 ${
                !isTvPage &&
                `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
              }`}
            >
              <IonIcon icon={filmOutline} className="text-[1.25rem]" />
              <span className="hidden md:block">Movies</span>
            </Link>
            <Link
              href={
                isSearchPage
                  ? URLSearchQuery
                    ? `/tv/search?query=${URLSearchQuery.replace(/\s+/g, "+")}`
                    : `/tv/search`
                  : `/tv`
              }
              className={`font-medium py-2 px-2 sm:px-4 rounded-lg hocus:bg-secondary hocus:bg-opacity-20 flex items-center gap-2 ${
                isTvPage &&
                `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
              }`}
            >
              <IonIcon icon={tvOutline} className="text-[1.25rem]" />
              <span className="hidden md:block">TV Series</span>
            </Link>
          </div>

          {/* <Link
            href={!isTvPage ? `/search` : `/tv/search`}
            className={`flex gap-2 items-center bg-secondary bg-opacity-20 self-center p-2 sm:px-4 rounded-lg hocus:bg-opacity-40 transition-all hocus:scale-105 active:scale-100 ml-auto`}
          >
            <IonIcon icon={search} className="text-[1.25rem]" />
            <span className="hidden sm:block">Search</span>
          </Link> */}

          <Link
            href={!isTvPage ? `/search` : `/tv/search`}
          className={`btn btn-sm h-[40px] btn-ghost bg-secondary bg-opacity-20`}
          >
            <IonIcon icon={search} className="text-[1.25rem]" />
            <span className="hidden sm:block">Search</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
