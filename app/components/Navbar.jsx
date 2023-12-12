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

  const isMoviesPage =
    pathname.startsWith("/movies") ||
    pathname === "/" ||
    pathname.startsWith("/search");
  const isTvPage = pathname.startsWith("/tv");
  const isSearchPage = pathname.startsWith(
    !isTvPage ? `/search` : `/tv/search`
  );
  let URLSearchQuery = useSearchParams().get("query");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-base-100 backdrop-blur bg-opacity-[85%]">
      <nav className="mx-auto py-2 px-4 max-w-7xl grid grid-cols-2 lg:grid-cols-3">
        <Link
          href={!isTvPage ? `/` : `/tv`}
          className="flex gap-1 items-center font-semibold tracking-wide leading-none max-w-fit"
          aria-labelledby={`Home`}
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

        {!isSearchPage && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target[0].value;

              if (!query) return;
              router.push(
                `${!isTvPage ? `/search` : `/tv/search`}?query=${query.replace(
                  /\s+/g,
                  "+"
                )}`
              );
            }}
            className={`hidden lg:block form-control w-full justify-self-center relative`}
          >
            <input
              type={`text`}
              placeholder={`Search`}
              className={`input input-bordered bg-opacity-[50%] rounded-full w-full pl-10`}
            />
            <IonIcon
              icon={search}
              className={`absolute left-3 top-[50%] translate-y-[-50%] text-lg text-gray-400 pointer-events-none`}
            />
            <input type={`submit`} className={`sr-only`} />
          </form>
        )}

        <div className="flex items-center gap-2 lg:col-[3/4] justify-self-end">
          <div className="flex place-content-center w-fit gap-1 p-1 rounded-full bg-gray-900 bg-opacity-[50%]">
            <Link
              href={
                isSearchPage
                  ? URLSearchQuery
                    ? `/search?query=${URLSearchQuery.replace(/\s+/g, "+")}`
                    : `/search`
                  : `/`
              }
              className={`transition-all font-medium py-2 px-2 md:px-4 rounded-full hocus:bg-secondary hocus:bg-opacity-20 flex items-center gap-2 ${
                isMoviesPage &&
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
              className={`transition-all font-medium py-2 px-2 md:px-4 rounded-full hocus:bg-secondary hocus:bg-opacity-20 flex items-center gap-2 ${
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
            className={`lg:hidden btn btn-sm h-[40px] btn-ghost bg-secondary bg-opacity-20 rounded-full !px-0 aspect-square md:aspect-auto md:!px-3`}
          >
            <IonIcon icon={search} className="text-[1.25rem]" />
            <span className="hidden md:block">Search</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
