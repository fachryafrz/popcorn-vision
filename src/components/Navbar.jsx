import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ logo }) {
  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");
  const isSearchTvPage = location.pathname.startsWith("/tv/search");
  const isSearchPage = location.pathname.startsWith("/search");

  return (
    <nav className="sticky top-0 z-50 bg-base-dark-gray backdrop-blur-sm bg-opacity-90">
      <h1 className="sr-only">Popcorn Vision</h1>
      <div className="max-w-7xl mx-auto py-2 px-6 flex flex-wrap justify-between">
        <Link
          to={isTvPage ? `/tv` : `/`}
          className="flex gap-2 items-center font-semibold tracking-wide leading-none max-w-fit"
        >
          <figure className="aspect-square w-[50px] border-r pr-2">
            <img loading="lazy" src={logo} alt="Popcorn Vision" />
          </figure>
          <span>
            Popcorn <br />
            Vision
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            to={isTvPage ? `/` : `/tv`}
            className={`text-base-gray ${
              isTvPage === "/tv" ? `hidden` : `flex`
            } items-center gap-2 hover:text-white`}
          >
            <IonIcon
              icon={isTvPage ? Icons.filmOutline : Icons.tvOutline}
              className="text-[1.25rem]"
            />
            <span className="hidden xs:block">
              {isTvPage ? `Movies` : `TV Shows`}
            </span>
          </Link>
          <Link
            to={isTvPage ? `/tv/search` : `/search`}
            className={`${
              isSearchPage || isSearchTvPage === true ? `hidden` : `flex`
            } gap-2 items-center bg-base-gray bg-opacity-20 self-center p-2 sm:px-4 rounded-lg hover:bg-opacity-40 transition-all hover:scale-105 active:scale-100 ml-auto`}
          >
            <IonIcon icon={Icons.search} className="text-[1.25rem]" />
            <span className="hidden sm:block">Search</span>
          </Link>
          <Link
            to={isTvPage ? `/search` : `/tv/search`}
            className={`${
              isSearchPage || isSearchTvPage === true ? `flex` : `hidden`
            } gap-2 items-center bg-base-gray bg-opacity-20 self-center p-2 sm:px-4 rounded-lg hover:bg-opacity-40 transition-all hover:scale-105 active:scale-100 ml-auto`}
          >
            <IonIcon icon={Icons.search} className="text-[1.25rem]" />
            <span className="hidden sm:block">
              Search {isSearchTvPage ? `Movies` : `TV Shows`}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
