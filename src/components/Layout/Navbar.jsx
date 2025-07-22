/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import { filmOutline, tvOutline, search } from "ionicons/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import { usePathname, useSearchParams } from "next/navigation";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import LoginButton from "../User/LoginButton";
import { useAuth } from "@/hooks/auth";
import LogoutButton from "../User/LogoutButton";
import { POPCORN } from "@/lib/constants";
import { useToggleFilter } from "@/zustand/toggleFilter";
import { userStore } from "@/zustand/userStore";
import { SearchBar } from "./SearchBar";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user } = useAuth();
  const { setUser } = userStore();
  const { setToggleFilter } = useToggleFilter();

  const [isScrolled, setIsScrolled] = useState(true);

  useEffect(() => {
    if (!user) setUser(null);

    setUser(user);
  }, [user]);

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
            description: `Takes you back to the main page of ${siteConfig.name}. Click to return to the homepage and start navigation from the beginning.`,
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
            description: `Takes you back to the main page of ${siteConfig.name}. Click to return to the homepage and start navigation from the beginning.`,
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
  const isProfilePage = pathname.startsWith("/profile");

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
    <header className={`fixed inset-x-0 top-0 z-[60]`}>
      {/* For blur effect, I did this way in order to make autocomplete blur work */}
      <div
        className={`absolute inset-0 -z-10 bg-base-100 transition-all ${
          isScrolled ? `bg-opacity-[85%] backdrop-blur` : `bg-opacity-0`
        }`}
      ></div>

      <nav className="mx-auto grid max-w-none grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 lg:!grid-cols-3">
        <div className={`flex items-center`}>
          <Link
            id={`Home`}
            href={{
              pathname:
                (isProfilePage && searchParams.get("type") === "tv") || isTvPage
                  ? `/tv`
                  : `/`,
            }}
            prefetch={false}
            className="flex max-w-fit items-center gap-1 font-semibold leading-none tracking-wide"
            aria-labelledby={`Home`}
          >
            <figure
              style={{
                background: `url(${POPCORN})`,
              }}
              className={`aspect-square w-[50px] !bg-contain`}
            ></figure>
            <figcaption
              data-after-content={siteConfig.name}
              className={`!after-content w-[70px] after:hidden after:h-full after:items-center after:leading-tight xs:after:flex`}
            ></figcaption>
          </Link>
        </div>

        {/* Search bar */}
        <div className={`hidden sm:block`}>
          <SearchBar />
        </div>

        {/* Movie & TV Shows Switcher */}
        <div className="col-span-2 flex items-center gap-2 justify-self-end sm:col-span-1 lg:col-[3/4]">
          <div className={`sm:hidden`}>
            <Link
              id={`SearchBarMobile`}
              href={!isTvPage ? `/search` : `/tv/search`}
              prefetch={false}
              className={`btn btn-secondary btn-sm aspect-square h-[40px] rounded-full border-none bg-opacity-20 !px-0 hocus:bg-opacity-50 md:aspect-auto md:!px-3 lg:hidden`}
            >
              <IonIcon
                icon={search}
                style={{
                  fontSize: 20,
                }}
              />
              <span className="hidden lg:block">Search</span>
            </Link>
          </div>

          <div
            id={`FilmSwitcher`}
            className="flex w-fit place-content-center gap-1 rounded-full bg-neutral bg-opacity-50 p-1 backdrop-blur-sm"
          >
            <Link
              href={{
                pathname: !isProfilePage
                  ? !isSearchPage
                    ? `/`
                    : `/search`
                  : `/profile`,
                query: !isProfilePage ? searchParams.toString() : ``,
              }}
              prefetch={false}
              className={`flex items-center gap-2 rounded-full px-2 py-2 font-medium transition-all hocus:bg-white hocus:bg-opacity-10 lg:px-4 ${
                (isMoviesPage ||
                  (isProfilePage && !searchParams.has("type"))) &&
                `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
              }`}
            >
              <IonIcon
                icon={filmOutline}
                style={{
                  fontSize: 20,
                }}
              />
              <span className="hidden lg:block">Movies</span>
            </Link>
            <Link
              href={{
                pathname: !isProfilePage
                  ? !isSearchPage
                    ? `/tv`
                    : `/tv/search`
                  : `/profile`,
                query: !isProfilePage ? searchParams.toString() : `type=tv`,
              }}
              prefetch={false}
              className={`flex items-center gap-2 rounded-full px-2 py-2 font-medium transition-all hocus:bg-white hocus:bg-opacity-10 lg:px-4 ${
                (isTvPage ||
                  (isProfilePage && searchParams.get("type") === "tv")) &&
                `bg-white text-base-100 hocus:!bg-white hocus:!bg-opacity-100`
              }`}
            >
              <IonIcon
                icon={tvOutline}
                style={{
                  fontSize: 20,
                }}
              />
              <span className="hidden lg:block">TV Shows</span>
            </Link>
          </div>

          {!user ? <LoginButton /> : <LogoutButton user={user} />}
        </div>
      </nav>
    </header>
  );
}
