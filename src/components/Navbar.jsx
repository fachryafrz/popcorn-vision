/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { filmOutline, tvOutline, search, close } from "ionicons/icons";
import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Reveal from "../lib/Reveal";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [filmType, setFilmType] = useState("movie");

  useEffect(() => {
    let steps;
    let desktop = window.matchMedia("(min-width: 1024px)");

    if (desktop.matches) {
      steps = [
        {
          element: "#Home",
          popover: {
            title: "Navigate to Home",
            description: `Takes you back to the main page of ${process.env.NEXT_PUBLIC_APP_NAME}. Click to return to the homepage and start navigation from the beginning.`,
          },
        },
        {
          element: "#SearchBar",
          popover: {
            title: "Find any films!",
            description:
              "Allows you to quickly find your favorite Movies or TV Series. Type any titles to discover the content you're looking for.",
          },
        },
        {
          element: "#FilmSwitcher",
          popover: {
            title: "Movies / TV Series?",
            description:
              "This film switcher enables you to toggle view between Movies and TV Series. Use it to filter and display content based on your viewing preferences.",
          },
        },
      ];
    } else {
      steps = [
        {
          element: "#Home",
          popover: {
            title: "Navigate to Home",
            description: `Takes you back to the main page of ${process.env.NEXT_PUBLIC_APP_NAME}. Click to return to the homepage and start navigation from the beginning.`,
          },
        },
        {
          element: "#FilmSwitcher",
          popover: {
            title: "Movies / TV Series?",
            description:
              "This film switcher enables you to toggle view between Movies and TV Series. Use it to filter and display content based on your viewing preferences.",
          },
        },
        {
          element: "#SearchBarMobile",
          popover: {
            title: "Find any films!",
            description:
              "Allows you to quickly find your favorite Movies or TV Series. Type in titles, genres, or names to discover the content you're looking for.",
          },
        },
      ];
    }

    // Driver JS
    const driverObj = driver({
      popoverClass: "bg-base-100 backdrop-blur bg-opacity-[85%] text-white",
      allowClose: false,
      showProgress: false,
      onDestroyed: () => {
        localStorage.setItem("is-driver-shown", true);
      },
      steps: steps,
    });

    // NOTE: Uncomment this to show driver.js
    // if (!localStorage.getItem("is-driver-shown")) {
    //   driverObj.drive();
    // }
  }, []);

  const isMoviesPage =
    pathname.startsWith("/movies") ||
    pathname === "/" ||
    pathname.startsWith("/search");
  const isTvPage = pathname.startsWith("/tv");
  const isSearchPage = pathname.startsWith(
    !isTvPage ? `/search` : `/tv/search`
  );
  let URLSearchQuery = searchParams.get("query");

  const handleFilmTypeChange = (type) => {
    const isTvType = type === "tv";

    setFilmType(type);

    if (isSearchPage) {
      if (URLSearchQuery) {
        router.push(
          `${
            !isTvType ? `/search` : `/tv/search`
          }?query=${URLSearchQuery.replace(/\s+/g, "+")}`
        );
      } else {
        router.push(`${!isTvType ? `/search` : `/tv/search`}`);
      }
    } else {
      router.push(!isTvType ? `/` : `/tv`);
    }
  };

  useEffect(() => {
    if (!URLSearchQuery) return;

    setSearchInput(URLSearchQuery);
  }, [URLSearchQuery]);

  useEffect(() => {
    window.addEventListener("scroll", function () {
      if (window.scrollY >= 1) {
        setIsScrolled(true);
      } else if (window.scrollY < 1) {
        setIsScrolled(false);
      }
    });
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all bg-base-100 ${
        isScrolled ? `backdrop-blur bg-opacity-[85%]` : `bg-opacity-0`
      }`}
    >
      <nav className="mx-auto py-2 px-4 max-w-none grid grid-cols-2 lg:grid-cols-3">
        <Reveal y={-20}>
          <Link
            id={`Home`}
            href={!isTvPage ? `/` : `/tv`}
            className="flex gap-1 items-center font-semibold tracking-wide leading-none max-w-fit"
            aria-labelledby={`Home`}
          >
            <figure
              style={{
                background: `url(/apple-touch-icon.png)`,
              }}
              className={`w-[50px] aspect-square !bg-contain`}
            ></figure>
            <figcaption
              className={`w-[70px] after:content-["Popcorn_Vision"] after:leading-tight after:h-full after:flex after:items-center`}
            ></figcaption>
          </Link>
        </Reveal>

        {/* Search bar */}
        <div className={`hidden lg:block`}>
          <Reveal y={-20} delay={0.2}>
            <Suspense>
              <SearchBar />
            </Suspense>
          </Reveal>
        </div>

        {/* Movie & TV Series Switcher */}
        <div className="flex items-center gap-2 lg:col-[3/4] justify-self-end">
          <Reveal y={-20} delay={0.4}>
            <div
              id={`FilmSwitcher`}
              className="flex place-content-center w-fit gap-1 p-1 rounded-full bg-gray-900 bg-opacity-[50%] backdrop-blur-sm"
            >
              <button
                onClick={() => handleFilmTypeChange("movie")}
                type={`button`}
                className={`transition-all font-medium py-2 px-2 md:px-4 rounded-full hocus:bg-secondary hocus:bg-opacity-20 flex items-center gap-2 ${
                  isMoviesPage &&
                  `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
                }`}
              >
                <IonIcon icon={filmOutline} className="text-[1.25rem]" />
                <span className="hidden md:block">Movies</span>
              </button>
              <button
                onClick={() => handleFilmTypeChange("tv")}
                type={`button`}
                className={`transition-all font-medium py-2 px-2 md:px-4 rounded-full hocus:bg-secondary hocus:bg-opacity-20 flex items-center gap-2 ${
                  isTvPage &&
                  `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
                }`}
              >
                <IonIcon icon={tvOutline} className="text-[1.25rem]" />
                <span className="hidden md:block">TV Series</span>
              </button>
            </div>
          </Reveal>

          <Reveal y={-20} delay={0.6} className={`lg:hidden`}>
            <Link
              id={`SearchBarMobile`}
              href={!isTvPage ? `/search` : `/tv/search`}
              className={`lg:hidden btn btn-sm h-[40px] btn-ghost bg-secondary bg-opacity-20 rounded-full !px-0 aspect-square md:aspect-auto md:!px-3`}
            >
              <IonIcon icon={search} className="text-[1.25rem]" />
              <span className="hidden md:block">Search</span>
            </Link>
          </Reveal>
        </div>
      </nav>
    </header>
  );
}

export function SearchBar({ placeholder = `Search or press "/"` }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");

  const isTvPage = pathname.startsWith("/tv");
  const isSearchPage = pathname.startsWith(
    !isTvPage ? `/search` : `/tv/search`
  );

  let URLSearchQuery = searchParams.get("query");

  useEffect(() => {
    if (!URLSearchQuery) {
      setSearchInput("");
    } else {
      setSearchInput(URLSearchQuery);
    }
  }, [URLSearchQuery]);

  useEffect(() => {
    if (isSearchPage) {
      searchRef?.current.focus();
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "/") {
        e.preventDefault();
        router.push(`${isTvPage ? "/tv" : ""}/search`);
      }
    });
  }, [isTvPage, router, isSearchPage]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = e.target[0].value.trim();

        const basePath = isTvPage ? "/tv" : "";
        const searchPath = `${basePath}/search`;
        const formattedQuery = query.replace(/\s+/g, "+");
        const searchQuery = `query=${formattedQuery}`;

        if (!query) {
          router.push(`${searchPath}`);
        } else {
          router.push(`${searchPath}?${searchQuery}`);
        }

        searchRef?.current.blur();
      }}
      id={`SearchBar`}
      className={`block form-control w-full justify-self-center relative`}
    >
      <div
        className={`flex items-center input input-bordered bg-opacity-[0%] rounded-full px-0`}
      >
        <div
          className={`pl-4 absolute h-full flex items-center pointer-events-none`}
        >
          <IonIcon
            icon={search}
            className={`text-lg text-gray-400 pointer-events-none`}
          />
        </div>

        <input
          type={`text`}
          ref={searchRef}
          placeholder={placeholder}
          className={`w-full bg-transparent pl-10 h-full pr-4`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {URLSearchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              router.push(`${isTvPage ? "/tv" : ""}/search`);
            }}
            className={`pl-4 absolute h-full flex items-center right-4`}
          >
            <IonIcon
              icon={close}
              className={`text-2xl text-gray-400 pointer-events-none`}
            />
          </button>
        )}
      </div>
      <input type={`submit`} className={`sr-only`} />
    </form>
  );
}
