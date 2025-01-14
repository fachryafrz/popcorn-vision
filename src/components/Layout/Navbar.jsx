/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { filmOutline, tvOutline, search, close } from "ionicons/icons";
import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import LoginButton from "../User/LoginButton";
import { useAuth } from "@/hooks/auth";
import LogoutButton from "../User/LogoutButton";
import { POPCORN_APPLE } from "@/lib/constants";
import { useToggleFilter } from "@/zustand/toggleFilter";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user } = useAuth();
  const { setToggleFilter } = useToggleFilter();

  const [searchInput, setSearchInput] = useState("");
  const [isScrolled, setIsScrolled] = useState(true);
  const [filmType, setFilmType] = useState("movie");

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setToggleFilter(true);
    } else {
      setToggleFilter(false);
    }
  }, []);

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
              "Allows you to quickly find your favorite Movies or TV Shows. Type any titles to discover the content you're looking for.",
          },
        },
        {
          element: "#FilmSwitcher",
          popover: {
            title: "Movies / TV Shows?",
            description:
              "This film switcher enables you to toggle view between Movies and TV Shows. Use it to filter and display content based on your viewing preferences.",
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
            title: "Movies / TV Shows?",
            description:
              "This film switcher enables you to toggle view between Movies and TV Shows. Use it to filter and display content based on your viewing preferences.",
          },
        },
        {
          element: "#SearchBarMobile",
          popover: {
            title: "Find any films!",
            description:
              "Allows you to quickly find your favorite Movies or TV Shows. Type in titles, genres, or names to discover the content you're looking for.",
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
    !isTvPage ? `/search` : `/tv/search`,
  );
  let URLSearchQuery = searchParams.get("query");
  const isThereAnyFilter =
    Object.keys(Object.fromEntries(searchParams)).length > 0;

  const handleFilmTypeChange = (type) => {
    const isTvType = type === "tv";

    setFilmType(type);

    if (isSearchPage) {
      if (isThereAnyFilter) {
        router.push(
          `${!isTvType ? `/search` : `/tv/search`}?${searchParams.toString()}`,
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
    const handleIsScrolled = () => {
      if (window.scrollY >= 1) {
        setIsScrolled(true);
      } else if (window.scrollY < 1) {
        setIsScrolled(false);
      }
    };

    handleIsScrolled();

    window.addEventListener("scroll", handleIsScrolled);

    return () => {
      window.removeEventListener("scroll", handleIsScrolled);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] bg-base-100 transition-all ${
        isScrolled ? `bg-opacity-[85%] backdrop-blur` : `bg-opacity-0`
      }`}
    >
      <nav className="mx-auto grid max-w-none grid-cols-3 px-4 py-2">
        <div className={`flex items-center`}>
          <Link
            id={`Home`}
            href={!isTvPage ? `/` : `/tv`}
            prefetch={true}
            className="flex max-w-fit items-center gap-1 font-semibold leading-none tracking-wide"
            aria-labelledby={`Home`}
          >
            <figure
              style={{
                background: `url(${POPCORN_APPLE})`,
              }}
              className={`aspect-square w-[50px] !bg-contain`}
            ></figure>
            <figcaption
              data-after-content={process.env.NEXT_PUBLIC_APP_NAME}
              className={`!after-content w-[70px] after:hidden after:h-full after:items-center after:leading-tight xs:after:flex`}
            ></figcaption>
          </Link>
        </div>

        {/* Search bar */}
        <div className={`hidden lg:block`}>
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        {/* Movie & TV Shows Switcher */}
        <div className="col-span-2 flex items-center gap-2 justify-self-end lg:col-[3/4]">
          <div
            id={`FilmSwitcher`}
            className="flex w-fit place-content-center gap-1 rounded-full bg-neutral bg-opacity-50 p-1 backdrop-blur-sm"
          >
            <button
              onClick={() => handleFilmTypeChange("movie")}
              type={`button`}
              className={`flex items-center gap-2 rounded-full px-2 py-2 font-medium transition-all hocus:bg-white hocus:bg-opacity-10 md:px-4 ${
                isMoviesPage &&
                `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
              }`}
            >
              <IonIcon
                icon={filmOutline}
                style={{
                  fontSize: 20,
                }}
              />
              <span className="hidden md:block">Movies</span>
            </button>
            <button
              onClick={() => handleFilmTypeChange("tv")}
              type={`button`}
              className={`flex items-center gap-2 rounded-full px-2 py-2 font-medium transition-all hocus:bg-white hocus:bg-opacity-10 md:px-4 ${
                isTvPage &&
                `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
              }`}
            >
              <IonIcon
                icon={tvOutline}
                style={{
                  fontSize: 20,
                }}
              />
              <span className="hidden md:block">TV Shows</span>
            </button>
          </div>

          <div className={`lg:hidden`}>
            <Link
              id={`SearchBarMobile`}
              href={!isTvPage ? `/search` : `/tv/search`}
              prefetch={true}
              className={`btn btn-secondary btn-sm aspect-square h-[40px] rounded-full border-none bg-opacity-20 !px-0 hocus:bg-opacity-50 md:aspect-auto md:!px-3 lg:hidden`}
            >
              <IonIcon
                icon={search}
                style={{
                  fontSize: 20,
                }}
              />
              <span className="hidden md:block">Search</span>
            </Link>
          </div>

          <div className={`h-[40px] w-[40px]`}>
            {!user ? <LoginButton /> : <LogoutButton user={user} />}
          </div>
        </div>
      </nav>
    </header>
  );
}

export function SearchBar({ placeholder = `Search` }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");

  const isTvPage = pathname.startsWith("/tv");
  const isSearchPage = pathname.startsWith(
    !isTvPage ? `/search` : `/tv/search`,
  );

  let URLSearchQuery = searchParams.get("query");

  const handleClear = () => {
    setSearchInput("");
    searchRef.current.focus();
  };

  useEffect(() => {
    if (URLSearchQuery) {
      setSearchInput(URLSearchQuery);
    }
  }, [URLSearchQuery]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "/") {
        if (document.activeElement !== searchRef.current) {
          event.preventDefault();
          searchRef.current.focus();
        }
      }

      if (event.key === "Escape") {
        if (document.activeElement === searchRef.current) {
          searchRef.current.blur();
        }
      }

      if (event.defaultPrevented) {
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

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
      className={`form-control relative block w-full justify-self-center`}
    >
      <div
        className={`input input-bordered flex items-center rounded-full bg-opacity-[0%] pl-0`}
      >
        <div className={`absolute flex h-full items-center pl-4`}>
          <Link
            href={!isTvPage ? `/search` : `/tv/search`}
            prefetch={true}
            className={`flex`}
          >
            <IonIcon
              icon={search}
              className={`pointer-events-none text-lg text-gray-400`}
            />
          </Link>
        </div>

        <input
          type={`text`}
          ref={searchRef}
          tabIndex={isSearchPage ? 0 : -1}
          placeholder={placeholder}
          className={`h-full w-full bg-transparent pl-10 pr-4`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className={`flex items-center gap-1`}>
          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className={`flex h-full items-center`}
            >
              <IonIcon
                icon={close}
                className={`text-gray-400`}
                style={{
                  fontSize: 24,
                }}
              />
            </button>
          )}

          <div className={`pointer-events-none hidden xl:inline`}>
            <kbd className={`kbd kbd-sm`}>/</kbd>
          </div>
        </div>
      </div>
    </form>
  );
}
